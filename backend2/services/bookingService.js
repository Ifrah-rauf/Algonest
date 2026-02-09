import { transporter } from "../utils/mailer.js";
import { supabase } from "../lib/supabase.js";
import dotenv from "dotenv";
dotenv.config();


/* ============================================================
   1) CREATE BOOKING
   - Sends a confirmation email when a booking is created
============================================================ */
export async function createBooking(booking) {
  const senderMail = process.env.SENDER_MAIL;

  // Send confirmation email
  await transporter.sendMail({
    from: `"AlgoNest" <${senderMail}>`,
    to: booking.email,
    subject: "Your AlgoNest Booking is Confirmed 🎉",
    html: `
      <h2 style="color:#6b46c1">Booking Confirmed for ${booking.plan}</h2>
      <p>Hi ${booking.username}, thanks for booking with <strong>AlgoNest</strong>.</p>
      <p><strong>Name:</strong> ${booking.username} ${booking.lastname}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Contact:</strong> ${booking.contact}</p>
      <p><strong>Requirement:</strong> ${booking.req}</p>
      <p><strong>Role:</strong> ${booking.role}</p>
      <p>Our team will reach out soon!</p>
    `
  });

  return booking;
}

/* ============================================================
   2) BOOKING MAIL
   - Fetches student, teacher, slot info and sends session email
============================================================ */
export async function bookingMail({ studentId, slot, meeting_link }) {
  const senderMail = "ifrahraufddps@gmail.com";

  // Fetch student
  const { data: student } = await supabase.from("student").select("*").eq("s_id", studentId).maybeSingle();
  if (!student) throw new Error("Student not found");

  // Fetch auth record
  const { data: auth } = await supabase.from("auth").select("*").eq("uid", student.uid).maybeSingle();
  if (!auth) throw new Error("Auth not found");

  // Fetch slot + availability
  const { data: slotData } = await supabase
    .from("timeslot")
    .select("*, availability:availabilityid(*)")
    .eq("slot_id", slot.slot_id)
    .maybeSingle();
  if (!slotData) throw new Error("TimeSlot not found");

  // Fetch teacher
  const { data: teacher } = await supabase.from("teacher").select("*").eq("t_id", slotData.availability.teacherid).maybeSingle();
  if (!teacher) throw new Error("Teacher not found");

  // Format date/time
  const date = new Date(slotData.startat).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const startTime = new Date(slotData.startat).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const endTime = new Date(slotData.endat).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  // Send email
  await transporter.sendMail({
    from: `"AlgoNest" <${senderMail}>`,
    to: auth.email,
    subject: "Your Session Is Booked! 🎉",
    html: `
      <h2>Your Session is Successfully Booked 🎉</h2>
      <p>Hi ${student.name}, your mentorship session has been booked.</p>
      <p><strong>Mentor:</strong> ${teacher.name}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${startTime} – ${endTime}</p>
      <p><strong>Duration:</strong> ${slotData.durationmin} mins</p>
      ${slotData.availability.isfree ? "<p>Free Session ✔</p>" : `<p>Payment Required: ₹${slotData.availability.price}</p>`}
      <a href="${meeting_link}">Join Meeting</a>
    `
  });

  return { student, teacher, slotData };
}

/* ============================================================
   3) GET PLAN
   - Checks if student has a valid plan with the teacher
============================================================ */
export async function getPlan({ userId, teacherId, slot }) {
  // Verify role
  const { data: roleData } = await supabase.from("auth").select("*").eq("uid", userId).maybeSingle();
  if (roleData.role !== "STUDENT") return { success: false, message: "You need a student plan." };

  // Fetch student
  const { data: student } = await supabase.from("student").select("*").eq("uid", userId).maybeSingle();
  const studentId = student.s_id;

  // Fetch booking
  const { data: booking } = await supabase.from("booking").select("*").eq("s_id", studentId).maybeSingle();
  if (!booking) return { success: false, message: "User has no plan subscription" };

  // Fetch teacher plans
  const { data: teacherPlans } = await supabase.from("teacher_plan").select("*").eq("t_id", teacherId).eq("plan_id", booking.plan_id);

  // Decide based on slot type
  if (slot.availability.type === "session") {
    return { success: true, message: "This Session is available for anyone!", planData: teacherPlans, studentId };
  }
  if (slot.availability.type === "plan") {
    if (!teacherPlans || teacherPlans.length === 0) return { success: false, message: "This teacher does not offer your subscribed plan" };
    return { success: true, message: "Matching teacher found!", planData: teacherPlans, studentId };
  }
}

/* ============================================================
   4) GET TIME SLOTS
   - Fetches available slots for a teacher
============================================================ */
export async function getTimeSlots(reqdata) {
  const { teachers_id }=reqdata;
  const { data: availSlots } = await supabase
    .from("timeslot")
    .select("slot_id, t_id, startat, endat, durationmin, isbooked, availability:availabilityid (*)")
    .eq("t_id", teachers_id);

  return { success: true, message: "Slots fetched", availSlots };
}

/* ============================================================
   5) BOOK PLAN
   - Deducts session, books slot, creates session record
============================================================ */
export async function bookPlan({ studentId, slot, meeting_link }) {
  // Fetch booking
  const { data: bookingData } = await supabase.from("booking").select("*").eq("s_id", studentId).maybeSingle();
  if (!bookingData) return { success: false, message: "User has no active plan." };

  // Check expiry & remaining sessions
  if (new Date(bookingData.expiry_date) < new Date()) return { success: false, message: "Your plan has expired." };
  if (bookingData.remainingsessions <= 0) return { success: false, message: "No remaining sessions." };

  // Deduct session
  await supabase.from("booking").update({ remainingsessions: bookingData.remainingsessions - 1 }).eq("booking_id", bookingData.booking_id);

  // Mark slot booked
  await supabase.from("timeslot").update({ isbooked: true }).eq("slot_id", slot.slot_id);

  // Fetch availability
  const { data: availability } = await supabase.from("availability").select("*").eq("a_id", slot.availabilityid).maybeSingle();
  if (!availability.isfree && availability.type === "session") {
    return { success: false, paymentRequired: true, amount: availability.price || 0, message: "Payment required." };
  }

  // Create slot booking
  await supabase.from("slotbooking").insert([{ slotid: slot.slot_id, studentid: studentId, bookingid: bookingData.booking_id, requirespayment: !availability.isfree, createdat: new Date() }]);

  // Fetch latest outline
  const { data: outline } = await supabase.from("plan_outline").select("*").eq("s_id", studentId).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (!outline) return { success: false, message: "No outline found for student." };

  // Create session
  await supabase.from("session").insert([{
    outline_id: outline.outline_id,
    s_id: studentId,
    t_id: slot.teacherid,
    session_link: meeting_link,
    start_time: slot.startat,
    end_time: slot.endat,
    duration: slot.durationmin,
    feedback: null
  }]);

  return { success: true, message: "Session Booked Successfully", time: slot.startat };
}
