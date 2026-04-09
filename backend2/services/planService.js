import { supabase } from "../lib/supabase.js";

export async function getCourseOutline(planId) {
  // plan_outline table is deprecated. Build outline-like response using bookings and sessions tied to the planId.
  // 1) fetch bookings that reference this plan
  const { data: bookings, error: bookingsError } = await supabase
    .from("booking")
    .select("booking_id, plan_id, remainingsessions")
    .eq("plan_id", planId);

  if (bookingsError) {
    console.error("getCourseOutline: failed to fetch bookings for planId", planId, bookingsError);
    return null;
  }

  if (!bookings || bookings.length === 0) return null;

  // use the first booking to report remaining sessions and plan association
  const booking = bookings[0];

  // 2) fetch sessions linked to any booking for this plan
  const bookingIds = bookings.map((b) => b.booking_id).filter(Boolean);
  const { data: sessions, error: sessionsError } = await supabase
    .from("session")
    .select(`
      session_id,
      start_time,
      end_time,
      duration,
      status,
      title,
      session_link,
      t_id
    `)
    .in("booking_id", bookingIds)
    .order("start_time", { ascending: true });

  if (sessionsError) {
    console.error("getCourseOutline: failed to fetch sessions for planId", planId, sessionsError);
    return null;
  }

  // 3) fetch plan metadata
  const { data: planArr, error: planError } = await supabase
    .from("plan")
    .select("plan_id, plan_name, sessions")
    .eq("plan_id", planId)
    .limit(1);

  if (planError || !planArr?.length) return null;
  const plan = planArr[0];

  const sessionIds = (sessions || []).map((s) => s.session_id);
  let attachments = [];
  if (sessionIds.length > 0) {
    const { data: attData } = await supabase
      .from("session_attachment")
      .select("*")
      .in("session_id", sessionIds);
    attachments = attData || [];
  }

  return {
    outline: null, // plan_outline removed; returning null
    sessions,
    attachments,
    totalSessions: plan.sessions,
    remSessions: booking.remainingsessions,
  };
}

export async function getLatestOutline(uid) {
  // plan_outline removed. Return latest booking for the student as an alternative.
  const { data: students, error: studentErr } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .limit(1);

  if (studentErr || !students?.length) return null;
  const student = students[0];

  const { data: bookings, error: bookingsError } = await supabase
    .from("booking")
    .select("booking_id, plan_id, remainingsessions, booking_date")
    .eq("s_id", student.s_id)
    .order("booking_date", { ascending: false })
    .limit(1);

  if (bookingsError || !bookings?.length) return null;
  return bookings[0];
}

export async function fetchPlans() {
  const { data: plans, error } = await supabase
    .from("plan")
    .select("plan_id, plan_name, description, durationdays, price, sessions")
    .order("plan_id");

  if (error) throw error;
  return plans;
}
export async function fetchCourse() {
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .order("course_id");

  if (error) throw error;
  return courses;
}
