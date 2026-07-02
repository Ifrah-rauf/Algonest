import { supabase } from "../lib/supabase.js";
import { markSessionCheckpointComplete } from "./rag/studentDataLayer.js";

function parseSessionDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const text = String(value).trim();
  if (!text) return null;

  const match = text.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{3}))?(?:\s?(Z|[+-]\d{1,2}(?::?\d{2})?))?$/
  );

  if (match) {
    const [, year, month, day, hours, minutes, seconds = "0", , offset] = match;
    if (offset) {
      return new Date(text);
    }
    return new Date(
      Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes),
        Number(seconds),
        0
      )
    );
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getSessionState(session, now = new Date()) {
  const status = String(session?.status || "").toUpperCase();
  const startTime = parseSessionDate(session?.start_time);
  const endTime = parseSessionDate(session?.end_time);

  if (startTime && now < startTime) return "UPCOMING";
  if (startTime && (!endTime || now <= endTime)) return "ACTIVE";
  if (endTime && now > endTime) return "EXPIRED";

  if (status === "COMPLETED") return "COMPLETED";
  if (status === "FAILED") return "FAILED";
  if (status === "PROCESSING") return "PROCESSING";
  if (status === "UPLOAD_RECEIVED") return "UPLOAD_RECEIVED";
  if (status === "ENDED_PENDING_UPLOAD") return "PENDING_UPLOAD";
  return "INACTIVE";
}

function pickRelevantSession(sessions, now = new Date()) {
  if (!Array.isArray(sessions) || !sessions.length) return null;

  const parsedSessions = sessions
    .map((session) => ({
      session,
      startTime: parseSessionDate(session?.start_time),
      endTime: parseSessionDate(session?.end_time),
    }))
    .filter(({ startTime }) => Boolean(startTime));

  const activeSession = parsedSessions.find(
    ({ startTime, endTime }) => startTime && startTime <= now && (!endTime || now <= endTime)
  );
  if (activeSession) return activeSession.session;

  const upcomingSessions = parsedSessions
    .filter(({ startTime }) => startTime > now)
    .sort((a, b) => a.startTime - b.startTime);
  if (upcomingSessions.length) return upcomingSessions[0].session;

  const pastSessions = parsedSessions
    .filter(({ endTime, startTime }) => (endTime && endTime < now) || (startTime && startTime <= now))
    .sort((a, b) => {
      const aTime = a.endTime || a.startTime;
      const bTime = b.endTime || b.startTime;
      return bTime - aTime;
    });

  return pastSessions[0]?.session || null;
}

async function getStudentIdByUid(uid) {
  const { data: studentData, error: studentError } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .single();

  if (studentError || !studentData) {
    throw new Error("Student not found");
  }

  return studentData.s_id;
}

async function getBookingIdsByStudentId(studentId) {
  const { data: bookings, error } = await supabase
    .from("booking")
    .select("booking_id")
    .eq("s_id", studentId)
    .order("booking_date", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch bookings");
  }

  return (bookings || []).map((booking) => booking.booking_id).filter(Boolean);
}

async function getSessionProcessingBySessionIds(sessionIds) {
  if (!sessionIds.length) return {};

  const { data, error } = await supabase
    .from("session_processing_jobs")
    .select("session_id, session_summary, mentor_feedback_text, summary_json, processing_status")
    .in("session_id", sessionIds);

  if (error) {
    console.error("Failed to fetch session processing summaries:", error.message);
    return {};
  }

  return Object.fromEntries((data || []).map((job) => [job.session_id, job]));
}

function attachSessionSummary(session, processingBySessionId) {
  const processing = processingBySessionId[session.session_id] || {};
  return {
    ...session,
    session_summary: processing.session_summary || processing.summary_json?.summary || null,
    mentor_feedback_text: processing.mentor_feedback_text || session.feedback || null,
    processing_status: processing.processing_status || null,
    summary_json: processing.summary_json || null,
  };
}

export async function getSessionPreparationData(slotId, studentIdFromAuth) {
  if (!studentIdFromAuth) {
    throw new Error("Unauthorized");
  }

  // 1️⃣ Fetch slot details
  const { data: slotData, error: slotError } = await supabase
    .from("slot") // your actual slot table name
    .select("*")
    .eq("slot_id", slotId)
    .single();

  if (slotError || !slotData) {
    throw new Error("Invalid slot");
  }

  // 2️⃣ Extract required values
  const teacherId = slotData.t_id;
  const startTime = slotData.start_time;

  return {
    studentId: studentIdFromAuth,
    t_id: teacherId,
    startTime,
    slotId
  };
}
export async function checkSessionData(uid) {
  const s_id = await getStudentIdByUid(uid);
  const bookingIds = await getBookingIdsByStudentId(s_id);
  if (!bookingIds.length) {
    return { exists: false };
  }

  const now = new Date();

  // Fetch all sessions and pick the one that is actually relevant right now.
  const { data: sessionData, error: sessionError } = await supabase
    .from("session")
    .select("*")
    .in("booking_id", bookingIds)
    .order("start_time", { ascending: true });

  if (sessionError) {
    throw new Error("Failed to fetch session");
  }

  const session = pickRelevantSession(sessionData, now);

  if (!session) {
    return { exists: false };
  }

  const state = getSessionState(session, now);
  const endTime = parseSessionDate(session.end_time);
  console.log("END TIME: " + endTime);
  console.log("sessionData: ", session, " state: ", state);
  return {
    exists: true,
    state,
    session,
  };
}

export async function checkTSessionData(uid) {

  // 1️⃣ Fetch student
  const { data: teacherData, error: tError } = await supabase
    .from("teacher")
    .select("t_id")
    .eq("uid", uid)
    .single();

  if (tError || !teacherData) {
    throw new Error("Student not found");
  }

  const t_id = teacherData.t_id;

  const now = new Date();

  // Fetch all sessions and choose the active one if available.
  const { data: sessionData, error: sessionError } = await supabase
    .from("session")
    .select("*")
    .eq("t_id", t_id)
    .order("start_time", { ascending: true })

  if (sessionError) {
    throw new Error("Failed to fetch session");
  }

  const session = pickRelevantSession(sessionData, now);

  if (!session) {
    return { exists: false };
  }

  const state = getSessionState(session, now);
  console.log("sessionData: ", session);
  return {
    exists: true,
    state,
    session,
  };
}

export async function sessionHistory(uid){
    const s_id = await getStudentIdByUid(uid);
    const bookingIds = await getBookingIdsByStudentId(s_id);
    if (!bookingIds.length) {
        return { session: [] };
    }

    // 2️⃣ Fetch latest session history for this student
    const { data: sessionData, error: sessionError } = await supabase
        .from("session")
        .select("*")
        .in("booking_id", bookingIds)
        .order("start_time", { ascending: false })

    if (sessionError) {
        throw new Error("Failed to fetch session");
    }

    const processingBySessionId = await getSessionProcessingBySessionIds(
        (sessionData || []).map((session) => session.session_id).filter(Boolean)
    );

    return {
        session: (sessionData || []).map((session) =>
            attachSessionSummary(session, processingBySessionId)
        )
    };
}
export async function completeSessionData({ sessionId, feedbackText = null }) {
  if (!sessionId) {
    throw new Error("sessionId is required");
  }

  const { data: session, error: sessionError } = await supabase
    .from("session")
    .select("session_id, booking_id")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (sessionError) {
    throw new Error(`Failed to fetch session: ${sessionError.message}`);
  }
  if (!session) {
    throw new Error("Session not found");
  }

  const { data: booking, error: bookingError } = await supabase
    .from("booking")
    .select("s_id")
    .eq("booking_id", session.booking_id)
    .maybeSingle();

  if (bookingError) {
    throw new Error(`Failed to fetch session booking: ${bookingError.message}`);
  }
  if (!booking?.s_id) {
    throw new Error("Student not found for session");
  }

  const { data, error } = await supabase
    .from("session")
    .update({
      marked_by_teacher: true,
      feedback: feedbackText?.trim() || null,
    })
    .eq("session_id", sessionId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to complete session: ${error.message}`);
  }

  await markSessionCheckpointComplete(sessionId, booking.s_id);

  return {
    ...data,
    s_id: booking.s_id,
  };
}
