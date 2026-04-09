import { supabase } from "../lib/supabase.js";

// Resolve teacher record by auth uid
export async function getTeacherByUid(uid) {
  if (!uid) throw new Error("teacher uid required");
  console.debug("teacherSessionService.getTeacherByUid: resolving uid=", uid);
  const { data, error } = await supabase
    .from("teacher")
    .select("t_id, uid, name")
    .eq("uid", uid)
    .single();

  if (error || !data) {
    console.error("teacherSessionService.getTeacherByUid: supabase error", error);
    throw new Error("Teacher not found");
  }

  console.debug("teacherSessionService.getTeacherByUid: found", data);
  return data; // { t_id, uid, name }
}

// Return array of students that have been connected to the given teacher (by t_id)
// Uses tables: session -> booking -> student (per provided schema)
// Each student object includes: s_id, uid, name, email (if present), lastSessionAt, hasActiveSession
export async function getStudentsConnectedToTeacher(t_id) {
  if (!t_id) throw new Error("t_id required");
  console.debug("teacherSessionService.getStudentsConnectedToTeacher: t_id=", t_id);

  // 1) fetch sessions for this teacher
  const { data: sessions, error: sessionsError } = await supabase
    .from("session")
    .select("session_id, booking_id, start_time, end_time, status")
    .eq("t_id", t_id);

  if (sessionsError) {
    console.error("teacherSessionService: failed to fetch sessions", sessionsError);
    throw new Error("Failed to fetch sessions");
  }

  console.debug("teacherSessionService: sessions fetched count=", (sessions || []).length);

  // Map booking_id -> sessions
  const sessionsWithBooking = (sessions || []).filter((s) => s.booking_id);
  const bookingIds = [...new Set(sessionsWithBooking.map((s) => s.booking_id))];

  console.debug("teacherSessionService: bookingIds count=", bookingIds.length);

  if (!bookingIds.length) {
    console.debug("teacherSessionService: no bookingIds, returning []");
    return [];
  }

  // 2) fetch bookings -> get s_id for each booking
  const { data: bookings, error: bookingsError } = await supabase
    .from("booking")
    .select("booking_id, s_id")
    .in("booking_id", bookingIds);

  if (bookingsError) {
    console.error("teacherSessionService: failed to fetch bookings", bookingsError);
    throw new Error("Failed to fetch bookings");
  }

  console.debug("teacherSessionService: bookings fetched count=", (bookings || []).length);

  const bookingToStudent = {};
  bookings.forEach((b) => {
    if (b && b.booking_id) bookingToStudent[b.booking_id] = b.s_id;
  });

  const studentIds = [...new Set(bookings.map((b) => b.s_id).filter(Boolean))];
  console.debug("teacherSessionService: studentIds count=", studentIds.length);
  if (!studentIds.length) {
    console.debug("teacherSessionService: no studentIds, returning []");
    return [];
  }

  // 3) fetch students
  const { data: students, error: studentsError } = await supabase
    .from("student")
    .select("s_id, uid, name")
    .in("s_id", studentIds);

  if (studentsError) {
    console.error("teacherSessionService: failed to fetch students", studentsError);
    throw new Error("Failed to fetch students");
  }

  console.debug("teacherSessionService: students fetched count=", (students || []).length);

  // 4) Aggregate sessions per student to compute lastSessionAt and active flag
  const sessionsByStudent = {};
  const now = new Date();
  sessionsWithBooking.forEach((s) => {
    const s_id = bookingToStudent[s.booking_id];
    if (!s_id) return;
    if (!sessionsByStudent[s_id]) sessionsByStudent[s_id] = [];
    sessionsByStudent[s_id].push(s);
  });

  const result = (students || []).map((st) => {
    const sSessions = sessionsByStudent[st.s_id] || [];
    let lastSessionAt = null;
    let hasActiveSession = false;

    sSessions.forEach((ss) => {
      const start = ss.start_time ? new Date(ss.start_time) : null;
      const end = ss.end_time ? new Date(ss.end_time) : null;
      if (start && (!lastSessionAt || start > lastSessionAt)) lastSessionAt = start;

      // An "active" session = start_time <= now && (no end_time || end_time >= now)
      if (start && start <= now && (!end || end >= now)) {
        hasActiveSession = true;
      }
    });

    return {
      s_id: st.s_id,
      uid: st.uid,
      name: st.name,
      lastSessionAt: lastSessionAt ? lastSessionAt.toISOString() : null,
      hasActiveSession
    };
  });

  // sort: active students first, then by lastSessionAt desc
  result.sort((a, b) => {
    if (a.hasActiveSession && !b.hasActiveSession) return -1;
    if (!a.hasActiveSession && b.hasActiveSession) return 1;
    const da = a.lastSessionAt ? new Date(a.lastSessionAt).getTime() : 0;
    const db = b.lastSessionAt ? new Date(b.lastSessionAt).getTime() : 0;
    return db - da;
  });

  console.debug("teacherSessionService: returning students count=", result.length);
  return result;
}

export async function getStudentsForTeacherByUid(uid) {
  const teacher = await getTeacherByUid(uid);
  if (!teacher || !teacher.t_id) throw new Error("Teacher not found");
  return getStudentsConnectedToTeacher(teacher.t_id);
}
