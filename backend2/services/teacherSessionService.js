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

async function getSessionProcessingBySessionIds(sessionIds) {
  if (!sessionIds.length) return {};

  const { data, error } = await supabase
    .from("session_processing_jobs")
    .select("session_id, session_summary, mentor_feedback_text, summary_json, processing_status")
    .in("session_id", sessionIds);

  if (error) {
    console.error("teacherSessionService: failed to fetch session summaries", error.message);
    return {};
  }

  return Object.fromEntries((data || []).map((job) => [job.session_id, job]));
}

function buildSummaryFields(session, processingBySessionId) {
  const processing = processingBySessionId[session?.session_id] || {};
  return {
    session_summary: processing.session_summary || processing.summary_json?.summary || null,
    mentor_feedback_text: processing.mentor_feedback_text || session?.feedback || null,
    processing_status: processing.processing_status || null,
    summary_json: processing.summary_json || null,
  };
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
    .select("session_id, booking_id, start_time, end_time, status, join_url, start_url, feedback")
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

  // 4) Aggregate sessions per student to compute lastSessionAt, active flag and include latest session info
  const sessionsByStudent = {};
  const processingBySessionId = await getSessionProcessingBySessionIds(
    sessionsWithBooking.map((session) => session.session_id).filter(Boolean)
  );
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
    let latestSession = null;

    sSessions.forEach((ss) => {
      const start = ss.start_time ? new Date(ss.start_time) : null;
      const end = ss.end_time ? new Date(ss.end_time) : null;
      if (start && (!lastSessionAt || start > lastSessionAt)) lastSessionAt = start;

      // keep track of latest session by start time
      if (start && (!latestSession || start > new Date(latestSession.start_time))) {
        latestSession = ss;
      }

      // An "active" session = start_time <= now && (no end_time || end_time >= now)
      if (start && start <= now && (!end || end >= now)) {
        hasActiveSession = true;
      }
    });

    // derive a session state for the latest session (if any)
    let sessionState = "INACTIVE"; // ACTIVE | UPCOMING | EXPIRED | INACTIVE
    let sessionStatus = null;
    let sessionJoinUrl = null;
    let sessionStartUrl = null;
    let sessionId = null;
    if (latestSession) {
      sessionStatus = latestSession.status || null;
      sessionJoinUrl = latestSession.join_url || null;
      sessionStartUrl = latestSession.start_url || null;
      sessionId = latestSession.session_id || null;
      const start = latestSession.start_time ? new Date(latestSession.start_time) : null;
      const end = latestSession.end_time ? new Date(latestSession.end_time) : null;
      if (start) {
        if (start <= now && (!end || end >= now)) sessionState = "ACTIVE";
        else if (start > now) sessionState = "UPCOMING";
        else if (end && end < now) sessionState = "EXPIRED";
      }
    }

    return {
      s_id: st.s_id,
      uid: st.uid,
      name: st.name,
      lastSessionAt: lastSessionAt ? lastSessionAt.toISOString() : null,
      last_session_time: latestSession?.start_time || null,
      hasActiveSession,
      session: latestSession
        ? {
            session_id: sessionId,
            status: sessionStatus,
            state: sessionState,
            join_url: sessionJoinUrl,
            start_url: sessionStartUrl,
            start_time: latestSession.start_time,
            end_time: latestSession.end_time,
            ...buildSummaryFields(latestSession, processingBySessionId),
          }
        : null,
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

// Return all sessions (including duplicate students) with booking details
// Each entry represents a single booking/session
export async function getAllSessionsForTeacherByUid(uid) {
  const teacher = await getTeacherByUid(uid);
  if (!teacher || !teacher.t_id) throw new Error("Teacher not found");

  const t_id = teacher.t_id;
  console.debug("teacherSessionService.getAllSessionsForTeacherByUid: t_id=", t_id);

  // 1) fetch sessions for this teacher
  const { data: sessions, error: sessionsError } = await supabase
    .from("session")
    .select("session_id, booking_id, start_time, end_time, status, join_url, start_url, feedback")
    .eq("t_id", t_id);

  if (sessionsError) {
    console.error("teacherSessionService.getAllSessionsForTeacherByUid: failed to fetch sessions", sessionsError);
    throw new Error("Failed to fetch sessions");
  }

  console.debug("teacherSessionService.getAllSessionsForTeacherByUid: sessions fetched count=", (sessions || []).length);

  // Map booking_id -> sessions
  const sessionsWithBooking = (sessions || []).filter((s) => s.booking_id);
  const bookingIds = [...new Set(sessionsWithBooking.map((s) => s.booking_id))];

  console.debug("teacherSessionService.getAllSessionsForTeacherByUid: bookingIds count=", bookingIds.length);

  if (!bookingIds.length) {
    console.debug("teacherSessionService.getAllSessionsForTeacherByUid: no bookingIds, returning []");
    return [];
  }

  // 2) fetch bookings -> get s_id for each booking
  const { data: bookings, error: bookingsError } = await supabase
    .from("booking")
    .select("booking_id, s_id, booking_date")
    .in("booking_id", bookingIds);

  if (bookingsError) {
    console.error("teacherSessionService.getAllSessionsForTeacherByUid: failed to fetch bookings", bookingsError);
    throw new Error("Failed to fetch bookings");
  }

  console.debug("teacherSessionService.getAllSessionsForTeacherByUid: bookings fetched count=", (bookings || []).length);

  const studentIds = [...new Set(bookings.map((b) => b.s_id).filter(Boolean))];
  console.debug("teacherSessionService.getAllSessionsForTeacherByUid: studentIds count=", studentIds.length);

  if (!studentIds.length) {
    console.debug("teacherSessionService.getAllSessionsForTeacherByUid: no studentIds, returning []");
    return [];
  }

  // 3) fetch students
  const { data: students, error: studentsError } = await supabase
    .from("student")
    .select("s_id, uid, name")
    .in("s_id", studentIds);

  if (studentsError) {
    console.error("teacherSessionService.getAllSessionsForTeacherByUid: failed to fetch students", studentsError);
    throw new Error("Failed to fetch students");
  }

  console.debug("teacherSessionService.getAllSessionsForTeacherByUid: students fetched count=", (students || []).length);

  // 4) Create a map of student data
  const studentMap = {};
  (students || []).forEach((st) => {
    studentMap[st.s_id] = st;
  });

  // 5) Create a map of booking data
  const bookingMap = {};
  (bookings || []).forEach((b) => {
    bookingMap[b.booking_id] = b;
  });

  // 6) Build result: one entry per session/booking
  const processingBySessionId = await getSessionProcessingBySessionIds(
    sessionsWithBooking.map((session) => session.session_id).filter(Boolean)
  );
  const now = new Date();
  const result = sessionsWithBooking.map((s) => {
    const booking = bookingMap[s.booking_id] || {};
    const student = studentMap[booking.s_id] || {};
    const start = s.start_time ? new Date(s.start_time) : null;
    const end = s.end_time ? new Date(s.end_time) : null;

    // derive session state
    let sessionState = "INACTIVE";
    if (start) {
      if (start <= now && (!end || end >= now)) sessionState = "ACTIVE";
      else if (start > now) sessionState = "UPCOMING";
      else if (end && end < now) sessionState = "EXPIRED";
    }

    return {
      s_id: student.s_id,
      uid: student.uid,
      name: student.name,
      booking_id: s.booking_id,
      session_id: s.session_id,
      session_time: s.start_time || null,
      session_end_time: s.end_time || null,
      booking_date: booking.booking_date ? new Date(booking.booking_date).toISOString() : null,
      lastSessionAt: start ? start.toISOString() : null,
      hasActiveSession: sessionState === "ACTIVE",
      session: {
        session_id: s.session_id,
        status: s.status || null,
        state: sessionState,
        join_url: s.join_url || null,
        start_url: s.start_url || null,
        start_time: s.start_time,
        end_time: s.end_time,
        ...buildSummaryFields(s, processingBySessionId),
      },
      ...buildSummaryFields(s, processingBySessionId),
    };
  });

  // sort: active sessions first, then by booking_date desc
  result.sort((a, b) => {
    if (a.hasActiveSession && !b.hasActiveSession) return -1;
    if (!a.hasActiveSession && b.hasActiveSession) return 1;
    const da = a.booking_date ? new Date(a.booking_date).getTime() : 0;
    const db = b.booking_date ? new Date(b.booking_date).getTime() : 0;
    return db - da;
  });

  console.debug("teacherSessionService.getAllSessionsForTeacherByUid: returning sessions count=", result.length);
  return result;
}
