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

async function getExistingCourseBooking({ studentId, courseId }) {
  if (!studentId || !courseId) return null;

  const bookings = await dbFetch({
    query: supabase
      .from("booking")
      .select("*")
      .eq("s_id", studentId)
      .eq("course_id", courseId)
      .in("booking_status", ["pending", "active"])
      .in("payment_status", ["pending", "approved"])
      .order("booking_date", { ascending: false })
      .limit(10),
    label: "courseBooking/existingBooking",
  });

  const now = Date.now();
  return (bookings || []).find((booking) => {
    if (booking.booking_status === "pending") return true;
    const expiryTime = booking.expiry_date ? new Date(booking.expiry_date).getTime() : NaN;
    return booking.booking_status === "active" && Number.isFinite(expiryTime) && expiryTime > now;
  }) || null;
}

function buildExpiryDate(expiryDays) {
  const days = Number(expiryDays) > 0 ? Number(expiryDays) : 120;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

async function calculateRoadmapSessionAllowance(courseId) {
  const parsedCourseId = Number(courseId);
  const missedSessionBuffer = 2;
  const interviewSessions = 2;
  if (!parsedCourseId) return missedSessionBuffer + interviewSessions;

  const { count: checkpointCount, error: checkpointError } = await supabase
    .from("checkpoints")
    .select("checkpoint_id", { count: "exact", head: true })
    .eq("course_id", parsedCourseId);

  if (checkpointError) {
    throw new Error(`Failed to calculate roadmap checkpoint sessions: ${checkpointError.message}`);
  }

  return Number(checkpointCount || 0) + interviewSessions + missedSessionBuffer;
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
  const remainingSessions = await calculateRoadmapSessionAllowance(parsedCourseId);
  const existingBooking = await getExistingCourseBooking({
    studentId: student.s_id,
    courseId: parsedCourseId,
  });

  if (existingBooking) {
    const { data: updatedStudent, error: studentUpdateError } = await supabase
      .from("student")
      .update({
        course_id: parsedCourseId,
      })
      .eq("s_id", student.s_id)
      .select("s_id, uid, name, total_bookings, active_booking_id, course_id")
      .single();

    if (studentUpdateError) {
      throw new Error(`Existing booking found but failed to update the selected roadmap: ${studentUpdateError.message}`);
    }

    return {
      success: true,
      duplicate: true,
      message: "A booking request for this roadmap already exists.",
      booking: existingBooking,
      student: updatedStudent,
      email: { sent: false, reason: "Duplicate booking request" },
    };
  }

  const bookingPayload = {
    s_id: student.s_id,
    plan_id: planId ?? null,
    payment_id: paymentId ?? null,
    expiry_date: buildExpiryDate(expiryDays),
    remainingsessions: remainingSessions,
    course_id: parsedCourseId,
    project_id: projectId ?? null,
    payment_status: "pending",
    booking_status: "pending",
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
      course_id: parsedCourseId,
    })
    .eq("s_id", student.s_id)
    .select("s_id, uid, name, total_bookings, active_booking_id, course_id")
    .single();

  if (studentUpdateError) {
    throw new Error(`Booking created but failed to update the selected roadmap: ${studentUpdateError.message}`);
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
