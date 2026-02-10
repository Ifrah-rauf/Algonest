import { supabase } from "../lib/supabase.js";

export async function getActiveCourse(uid) {
  const { data: students } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .limit(1);

  if (!students?.length) return null;
  const s_id = students[0].s_id;

  const { data: bookings } = await supabase
    .from("booking")
    .select("*")
    .eq("s_id", s_id)
    .gt("expiry_date", new Date().toISOString())
    .order("booking_date", { ascending: false })
    .limit(1);

  if (!bookings?.length) return null;
  const booking = bookings[0];

  const { data: plans } = await supabase
    .from("plan")
    .select("plan_name, sessions, description")
    .eq("plan_id", booking.plan_id)
    .limit(1);

  const plan = plans?.[0];
  if (!plan) return null;

  return {
    desc: plan.description,
    outline_id: booking.outline_id,
    title: plan.plan_name,
    totalSessions: plan.sessions,
    remainingSessions: booking.remainingsessions,
  };
}

export async function getSessions(uid) {
  const { data: students } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .limit(1);

  if (!students?.length) return [];

  const s_id = students[0].s_id;

  const { data: sessions } = await supabase
    .from("session")
    .select("title, status, session_link, start_time")
    .eq("s_id", s_id)
    .order("start_time", { ascending: false });

  return sessions || [];
}

export async function getDashboardfunc(uid) {
  console.log("UID received:", uid);

  const { data: user, error: userErr } = await supabase
    .from("auth")
    .select("*")
    .eq("uid", uid)
    .single();

  if (userErr || !user) {
    throw new Error("User not found");
  }

  if (user.role === "TEACHER") {
    const { data: teacher, error } = await supabase
      .from("teacher")
      .select("*")
      .eq("uid", uid)
      .single();

    if (error) throw error;

    return {
      role: "TEACHER",
      data: teacher,
    };
  } else {
    const { data: student, error } = await supabase
      .from("student")
      .select("*")
      .eq("uid", uid)
      .single();

    if (error) throw error;

    return {
      role: "STUDENT",
      data: student,
    };
  }
}
