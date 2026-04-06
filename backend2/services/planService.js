import { supabase } from "../lib/supabase.js";

export async function getCourseOutline(planId) {
  const { data: outlineArr } = await supabase
    .from("plan_outline")
    .select("*")
    .eq("outline_id", planId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (!outlineArr?.length) return null;
  const outline = outlineArr[0];

  const { data: sessions } = await supabase
    .from("session")
    .select(`
      session_id,
      outline_id,
      start_time,
      end_time,
      duration,
      status,
      title,
      session_link,
      mentor:teacher (
        t_id,
        name,
        pfp,
        experience
      )
    `)
    .eq("outline_id", outline.outline_id)
    .order("start_time", { ascending: true });

  const { data: bookingArr } = await supabase
    .from("booking")
    .select("*")
    .eq("outline_id", outline.outline_id)
    .limit(1);

  if (!bookingArr?.length) return null;
  const booking = bookingArr[0];

  const { data: planArr } = await supabase
    .from("plan")
    .select("*")
    .eq("plan_id", booking.plan_id)
    .limit(1);

  if (!planArr?.length) return null;
  const plan = planArr[0];

  const sessionIds = sessions.map((s) => s.session_id);
  let attachments = [];
  if (sessionIds.length > 0) {
    const { data: attData } = await supabase
      .from("session_attachment")
      .select("*")
      .in("session_id", sessionIds);
    attachments = attData || [];
  }

  return {
    outline,
    sessions,
    attachments,
    totalSessions: plan.sessions,
    remSessions: booking.remainingsessions,
  };
}

export async function getLatestOutline(uid) {
  const { data: students } = await supabase
    .from("student")
    .select("*")
    .eq("uid", uid)
    .limit(1);

  if (!students?.length) return null;
  const student = students[0];

  const { data: outlines } = await supabase
    .from("plan_outline")
    .select("*")
    .eq("s_id", student.s_id)
    .order("created_at", { ascending: false })
    .limit(1);

  return outlines?.[0] || null;
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
