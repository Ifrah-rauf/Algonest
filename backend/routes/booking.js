import express from "express";
import { transporter } from "../utils/mailer.js";
import {supabase} from "../lib/supabase.js";
const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const booking = req.body;
    const mail = "ifrahraufddps@gmail.com"
    console.log("Received booking:", booking);

    // Send confirmation email
    await transporter.sendMail({
      from: `"AlgoNest" <${mail}>`,
      to: booking.email,
      subject: "Your AlgoNest Booking is Confirmed 🎉",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color:#6b46c1">Your booking is Confirmed for ${booking.plan}</h2>
          <p>Hi ${booking.username},</p>
          <p>Thanks for booking with <strong>AlgoNest</strong>.</p>

          <div style="background:#f7f7f7;padding:15px;border-radius:10px;">
            <p><strong>Name:</strong> ${booking.username} ${booking.lastname}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Contact:</strong> ${booking.contact}</p>
            <p><strong>Requirement:</strong> ${booking.req}</p>
            <p><strong>Role:</strong> ${booking.role}</p>
          </div>

          <p style="margin-top:20px;">Our team will reach out soon!</p>
          <p>Regards,<br/>AlgoNest Team</p>
        </div>
      `
    });

    return res.json({ success: true, message: "Booking created & email sent!" });

  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ success: false, message: "Email failed", error });
  }
});


router.post("/bookingMail", async (req, res) => {
  try {
    const { studentId, slot, meeting_link } = req.body;
    const mail = "ifrahraufddps@gmail.com";

    console.log("Incoming slot:", slot);

    /* ------------------------------
       1️⃣ Fetch student + auth details
    ------------------------------ */
    const { data: student } = await supabase
      .from("student")
      .select("*")
      .eq("s_id", studentId)
      .maybeSingle();

    if (!student) throw new Error("Student not found");

    const { data: auth } = await supabase
      .from("auth")
      .select("*")
      .eq("uid", student.uid)
      .maybeSingle();

    if (!auth) throw new Error("Auth not found");

    /* ------------------------------
       2️⃣ Fetch timeslot fully
    ------------------------------ */
    const { data: slotData } = await supabase
      .from("timeslot")
      .select("*, availability:availabilityid(*)")
      .eq("slot_id", slot.slot_id)
      .maybeSingle();

    if (!slotData) throw new Error("TimeSlot not found");

    const availability = slotData.availability;
    const teacherId = availability.teacherid;
    
    /* ------------------------------
       3️⃣ Fetch teacher
    ------------------------------ */
    const { data: teacher } = await supabase
      .from("teacher")
      .select("*")
      .eq("t_id", teacherId)
      .maybeSingle();

    if (!teacher) throw new Error("Teacher not found");

    /* ------------------------------
       4️⃣ Format times for email
    ------------------------------ */
    function format(dt) {
      return new Date(dt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    function formatDate(dt) {
      return new Date(dt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    const date = formatDate(slotData.startat);
    const startTime = format(slotData.startat);
    const endTime = format(slotData.endat);
    const duration = slotData.durationmin;

    const isFree = availability.isfree;
    const price = availability.price || 0;
    const desc = availability.desc || null;

    console.log("Email Data:", {
      student,
      teacher,
      date,
      startTime,
      endTime,
      duration,
      isFree,
      price,
      desc,
      meeting_link,
    });

    /* ------------------------------
       5️⃣ SEND EMAIL
    ------------------------------ */
    await transporter.sendMail({
      from: `"AlgoNest" <${mail}>`,
      to: auth.email,
      subject: "Your Session Is Booked! 🎉 (AlgoNest)",
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background:#fafafa;">
        
        <h2 style="color:#6b46c1; margin-bottom: 5px;">
          Your Session is Successfully Booked 🎉
        </h2>

        <p style="color:#555;">Hi <strong>${student.name}</strong>,</p>

        <p>Your 1:1 mentorship session has been booked on <strong>AlgoNest</strong>.</p>

        <div style="background:white; padding:18px; border-radius:12px; border:1px solid #ddd; margin-top:15px;">
          <p><strong>Mentor:</strong> ${teacher.name}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${startTime} – ${endTime}</p>
          <p><strong>Duration:</strong> ${duration} mins</p>

          ${
            isFree
              ? `<p style="color:#2f855a;"><strong>Payment:</strong> Free Session ✔</p>`
              : `<p style="color:#b83232;"><strong>Payment Required:</strong> ₹${price}</p>`
          }

          ${
            desc
              ? `<p style="margin-top:10px;"><strong>Session Type:</strong> ${desc}</p>`
              : ""
          }
        </div>

        <div style="margin-top:25px;">
          <p style="font-weight:bold;">Join with your meeting link:</p>
          <a href="${meeting_link}"
            style="background:#f6c90e; padding:10px 18px; text-decoration:none; color:#000; font-weight:bold; border-radius:8px;">
            Join Meeting
          </a>
        </div>

        <p style="margin-top:20px;">Regards,<br><strong>Team AlgoNest</strong></p>
      </div>
      `,
    });

    return res.json({ success: true, message: "Email sent successfully!" });

  } catch (error) {
    console.error("Booking Email Error:", error.message, error);
    return res.status(500).json({
      success: false,
      message: "Email failed",
      error: error.message,
    });
  }
});



router.post("/getPlan", async (req, res) => {
  const { userId, teacherId,slot } = req.body;
  console.log(slot);
  try {
    //check if user is a student
    const { data: roleData, error: roleError } = await supabase
      .from("auth")
      .select("*")
      .eq("uid", userId)
      .maybeSingle();
    if(roleData.role!="STUDENT"){
      return res.status(500).json({
        success: false,
        message: "You need a student plan.",
        error: roleError,
      });
    }
    //fetchind sid
     const { data: student} = await supabase
      .from("student")
      .select("*")
      .eq("uid", userId)
      .maybeSingle();
    const studentId=student.s_id;
    console.log("studentId: "+studentId);
    // 1) Check if user has a plan
    const { data: booking, error: bookingError } = await supabase
      .from("booking")
      .select("*")
      .eq("s_id", studentId)
      .maybeSingle(); // safer than .single()

    console.log("userId: "+userId);
    console.log("booking Data in getPlan: ");
    console.log(booking);

    if (bookingError) {
      console.error(bookingError);
      return res.status(500).json({
        success: false,
        message: "You do not have any active plan",
        error: bookingError,
      });
    }

    if (!booking) {
      return res.json({
        success: false,
        message: "User has no plan subscription",
      });
    }

    const planId = booking.plan_id;
    const { data: teacherPlans, error: teacherPlanError } = await supabase
      .from("teacher_plan")
      .select("*")
      .eq("t_id", teacherId)
      .eq("plan_id", planId);

    if (teacherPlanError) {
      console.error(teacherPlanError);
      return res.status(500).json({
        success: false,
        message: "Error fetching teacher plan",
        error: teacherPlanError,
      });
    }

    // teacherPlan is empty array → teacher does NOT offer the plan

    if (slot.availability.type === "session") {
    console.log("slot in the plan inside: "+slot.availability.type);
      return res.json({
      success: true,
      message: "Wohoo! This Session is available for anyone!",
      planData: teacherPlans,
      studentId:studentId
      })
    }
    if (slot.availability.type === "plan") {
          if (!teacherPlans || teacherPlans.length === 0) {
      return res.json({
        success: false,
        message: "This teacher does not offer your subscribed plan",
      });
    }
    // SUCCESS → Matching teacher-plan found
    return res.json({
      success: true,
      message: "Matching teacher found!",
      planData: teacherPlans,
      studentId:studentId
    });}
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});
 


router.post("/getTimeSlots", async (req, res) => {
   const { slot } = req.body;
   console.log("slot foim booking: "+slot);
   const { data: availSlots, error: slotError } = await supabase
      .from("timeslot")
.select("slot_id, teacherid, startat, endat, durationmin, isbooked, availability:availabilityid (*)")

      .eq("t_id", teacherid)
      // .eq("isbooked", false)
   return res.json({ success: true, message: "slot function hit" , availSlots:availSlots});
  });


router.post("/bookPlan", async (req, res) => {
  try {
    const { studentId, planData, slot, meeting_link } = req.body;

    console.log("\n📩 Incoming Book Request:", { studentId, planData, slot });

    if (!studentId || !slot) {
      console.error("❌ Missing required fields.");
      return res.status(400).json({ success: false, message: "Missing studentId or slot." });
    }

    // ============================
    // 1) FETCH BOOKING INFO
    // ============================
    const { data: bookingData, error: bookingFetchErr } = await supabase
      .from("booking")
      .select("*")
      .eq("s_id", studentId)
      .maybeSingle();

    if (bookingFetchErr) {
      console.error("❌ Booking Fetch Error:", bookingFetchErr);
      return res.status(500).json({ success: false, message: "Failed to fetch booking.", error: bookingFetchErr });
    }

    if (!bookingData) {
      console.error("❌ No booking record found for student:", studentId);
      return res.json({ success: false, message: "User has no active plan." });
    }

    console.log("📘 Booking Data:", bookingData);

    const today = new Date();
    const expiry = new Date(bookingData.expiry_date);

    // EXPIRED CHECK
    if (expiry < today) {
      console.warn("⚠️ Plan expired.");
      return res.json({ success: false, message: "Your plan has expired." });
    }

    // REMAINING CHECK
    if (bookingData.remainingsessions <= 0) {
      console.warn("⚠️ No remaining sessions.");
      return res.json({
        success: false,
        message: "No remaining sessions. Please renew your plan."
      });
    }

    // ============================
    // 2) DEDUCT SESSION
    // ============================
    const { error: deductErr } = await supabase
      .from("booking")
      .update({ remainingsessions: bookingData.remainingsessions - 1 })
      .eq("booking_id", bookingData.booking_id);

    if (deductErr) {
      console.error("❌ Session Deduction Error:", deductErr);
      return res.status(500).json({ success: false, message: "Failed to deduct session.", error: deductErr });
    }

    // ============================
    // 3) BOOK TIME SLOT
    // ============================
    const { error: slotErr } = await supabase
      .from("timeslot")   // FIXED TABLE NAME
      .update({ isbooked: true })
      .eq("slot_id", slot.slot_id);

    if (slotErr) {
      console.error("❌ TimeSlot Update Error:", slotErr);
      return res.status(500).json({ success: false, message: "Failed to book timeslot.", error: slotErr });
    }

    // console.log("⏳ Slot booked. Will auto-unbook in 1 hour.");

    // AUTO-UNBOOK AFTER 1 HOUR
    // setTimeout(async () => {
    //   console.log("⏳ Auto unbooking slot:", slot.slot_id);

    //   await supabase
    //     .from("timeslot")  // FIXED
    //     .update({ isbooked: false })
    //     .eq("slot_id", slot.slot_id);
    // }, 60 * 60 * 1000);

    // ============================
    // 4) PAYMENT CHECK
    // ============================

    // slot.availabilityid is just a NUMBER (FK), not full object.
    // You already fetched availability from DB earlier in mail route.
    // So fetch it here safely:
    const { data: availability, error: availErr } = await supabase
      .from("availability")
      .select("*")
      .eq("a_id", slot.availabilityid)
      .maybeSingle();

    if (availErr) {
      console.error("❌ Availability Fetch Error:", availErr);
      return res.status(500).json({ success: false, message: "Failed to fetch availability.", error: availErr });
    }

    console.log("📌 Availability:", availability);

    const isFree = availability?.isfree;
    const type = availability?.type;      // "plan" or "session"

    if (!isFree && type === "session") {
      console.warn("💰 Payment required.");
      return res.json({
        success: false,
        paymentRequired: true,
        amount: availability?.price || 0,
        message: "This session requires payment before booking."
      });
    }

    // ============================
    // 5) CREATE SLOTBOOKING ENTRY
    // ============================
    const { data: newSlot, error: bookErr } = await supabase
      .from("slotbooking")
      .insert([
        {
          slotid: slot.slot_id,
          studentid: studentId,
          bookingid: bookingData.booking_id,
          requirespayment: !isFree,
          createdat: today
        }
      ])
      .select()
      .single();

    if (bookErr) {
      console.error("❌ SlotBooking Insert Error:", bookErr);
      return res.status(500).json({ success: false, message: "Failed to create slot booking.", error: bookErr });
    }

    console.log("📘 SlotBooking Created:", newSlot);

    // ============================
    // 6) CREATE SESSION ENTRY
    // ============================
    const { data: outline, error: outlineErr } = await supabase
      .from("plan_outline")
      .select("*")
      .eq("s_id", studentId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (outlineErr) {
      console.error("❌ Outline Fetch Error:", outlineErr);
      return res.status(500).json({ success: false, message: "Failed to fetch outline.", error: outlineErr });
    }

    if (!outline) {
      console.error("❌ No outline found for student.");
      return res.status(500).json({ success: false, message: "No outline found for student." });
    }

    const outline_id = outline.outline_id;

    const { data: session, error: sessionError } = await supabase
      .from("session")
      .insert([
        {
          outline_id,
          s_id: studentId,
          t_id: slot.teacherid,
          session_link: meeting_link,
          start_time: slot.startat,
          end_time: slot.endat,
          duration: slot.durationmin,
          feedback: null
        }
      ])
      .select()
      .single();

    if (sessionError) {
      console.error("❌ SESSION INSERT ERROR:", sessionError);
      return res.status(500).json({
        success: false,
        message: "Failed to create session",
        error: sessionError
      });
    }

    console.log("🎉 Session Created:", session);
    const { error: slotUpdateError } = await supabase
      .from("timeslot")                 // table name must be exactly correct
      .update({ isbooked: true })       // or { isBooked: true } depending on schema
      .eq("slot_id", slot.slot_id);
    return res.json({
      success: true,
      message: "Session Booked Successfully",
      time: slot.startat
    });
  }

  catch (err) {
    console.error("🔥 SERVER CRASH ERROR:", err);
    return res.status(500).json({ success: false, message: "Server crash", error: err });
  }
});




export default router;
