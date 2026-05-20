import { supabase } from "../lib/supabase.js";

async function dbFetch({ query, label }) {
  const { data, error } = await query;
  if (error) throw new Error(`[${label}] ${error.message}`);
  return data;
}

async function getStudentByUid(uid) {
  if (!uid) return null;
  return dbFetch({
    query: supabase.from("student").select("s_id, uid, name").eq("uid", uid).maybeSingle(),
    label: "courseBooking/student",
  });
}

function buildExpiryDate(expiryDays) {
  const days = Number(expiryDays) > 0 ? Number(expiryDays) : 120;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
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

  const bookingPayload = {
    s_id: student.s_id,
    plan_id: planId ?? null,
    payment_id: paymentId ?? null,
    expiry_date: buildExpiryDate(expiryDays),
    remainingsessions: Number(remainingSessions) > 0 ? Number(remainingSessions) : null,
    course_id: Number(courseId) > 0 ? Number(courseId) : 1,
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

  return {
    success: true,
    booking: data,
    student,
  };
}
