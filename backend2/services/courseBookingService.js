import { supabase } from "../lib/supabase.js";
import { senderMail, transporter } from "../utils/mailer.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function dbFetch({ query, label }) {
  const { data, error } = await query;
  if (error) throw new Error(`[${label}] ${error.message}`);
  return data;
}

async function getStudentByUid(uid) {
  if (!uid) return null;
  return dbFetch({
    query: supabase
      .from("student")
      .select("s_id, uid, name, total_bookings")
      .eq("uid", uid)
      .maybeSingle(),
    label: "courseBooking/student",
  });
}

async function getAuthByUid(uid) {
  if (!uid) return null;
  return dbFetch({
    query: supabase.from("auth").select("uid, name, email").eq("uid", uid).maybeSingle(),
    label: "courseBooking/auth",
  });
}

async function getCourseById(courseId) {
  const parsedCourseId = Number(courseId);
  if (!parsedCourseId) return null;

  return dbFetch({
    query: supabase
      .from("courses")
      .select("course_id, title")
      .eq("course_id", parsedCourseId)
      .maybeSingle(),
    label: "courseBooking/course",
  });
}

function buildExpiryDate(expiryDays) {
  const days = Number(expiryDays) > 0 ? Number(expiryDays) : 120;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function buildCourseBookingEmail({ student, auth, booking, course }) {
  const studentName = auth?.name || student?.name || "AlgoNest Student";
  const courseName = course?.title || `Course ${booking.course_id}`;
  const rows = [
    ["Student ID", booking.s_id],
    ["Course", courseName],
    ["Course ID", booking.course_id],
    ["Booking ID", booking.booking_id],
    ["Plan ID", booking.plan_id ?? "Not assigned"],
    ["Payment ID", booking.payment_id ?? "Pending"],
    ["Project ID", booking.project_id ?? "Not assigned"],
    ["Remaining Sessions", booking.remainingsessions ?? "Not assigned"],
    ["Expiry Date", booking.expiry_date ? new Date(booking.expiry_date).toLocaleDateString("en-IN") : "Not assigned"],
  ];

  return {
    subject: `AlgoNest booking received for ${courseName}`,
    text: [
      `Hi ${studentName},`,
      "",
      "Thank you for booking with AlgoNest. An agent will reach you soon to complete the payment.",
      "",
      ...rows.map(([label, value]) => `${label}: ${value}`),
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;background:#faf7ff;padding:24px;border-radius:18px">
        <h2 style="margin:0 0 12px;color:#534AB7">Booking Received for ${escapeHtml(courseName)}</h2>
        <p>Hi ${escapeHtml(studentName)}, thank you for booking with <strong>AlgoNest</strong>.</p>
        <p style="margin:0 0 16px">An agent will reach you soon to complete the payment.</p>
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:16px">
          ${rows
            .map(
              ([label, value]) =>
                `<p style="margin:0 0 8px"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
            )
            .join("")}
        </div>
      </div>
    `,
  };
}

async function sendCourseBookingEmail({ student, auth, booking, course }) {
  if (!auth?.email) {
    return { sent: false, reason: "Student email not found" };
  }

  const email = buildCourseBookingEmail({ student, auth, booking, course });

  await transporter.sendMail({
    from: `"AlgoNest" <${senderMail}>`,
    to: auth.email,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });

  return {
    sent: true,
    recipient: auth.email,
  };
}

export async function createCourseBookingService({
  uid,
  courseId = 1,
  paymentId = null,
  planId = null,
  remainingSessions = 12,
  expiryDays = 120,
  projectId = null,
}) {
  if (!uid) {
    throw new Error("Missing uid");
  }

  const student = await getStudentByUid(uid);
  if (!student?.s_id) {
    throw new Error("Student not found for the current user");
  }

  const auth = await getAuthByUid(uid);
  const parsedCourseId = Number(courseId) > 0 ? Number(courseId) : 1;
  const course = await getCourseById(parsedCourseId);

  const bookingPayload = {
    s_id: student.s_id,
    plan_id: planId ?? null,
    payment_id: paymentId ?? null,
    expiry_date: buildExpiryDate(expiryDays),
    remainingsessions: Number(remainingSessions) > 0 ? Number(remainingSessions) : null,
    course_id: parsedCourseId,
    project_id: projectId ?? null,
  };

  const { data, error } = await supabase
    .from("booking")
    .insert([bookingPayload])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create booking: ${error.message}`);
  }

  const { data: updatedStudent, error: studentUpdateError } = await supabase
    .from("student")
    .update({
      active_booking_id: data.booking_id,
      course_id: parsedCourseId,
      total_bookings: Number(student.total_bookings || 0) + 1,
    })
    .eq("s_id", student.s_id)
    .select("s_id, uid, name, total_bookings, active_booking_id, course_id")
    .single();

  if (studentUpdateError) {
    throw new Error(`Booking created but failed to update student active booking: ${studentUpdateError.message}`);
  }

  let email = { sent: false, reason: "Email not attempted" };
  try {
    email = await sendCourseBookingEmail({ student: updatedStudent, auth, booking: data, course });
  } catch (err) {
    console.error("[courseBooking/email]", err.message);
    email = { sent: false, reason: err.message };
  }

  return {
    success: true,
    booking: data,
    student: updatedStudent,
    email,
  };
}
