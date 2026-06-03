import { supabase } from "../lib/supabase.js";

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

  // 2️⃣ Fetch latest VALID session for this student
  const { data: sessionData, error: sessionError } = await supabase
    .from("session")
    .select("*")
    .in("booking_id", bookingIds)
    .eq("status", "VALID")
    .order("start_time", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (sessionError) {
    throw new Error("Failed to fetch session");
  }

  if (!sessionData) {
    return { exists: false };
  }

    const now = new Date();
    const startTime = new Date(sessionData.start_time);
    const endTime = sessionData.end_time ? new Date(sessionData.end_time) : null;
    console.log("END TIME: "+endTime);
    let state = "INACTIVE";

    if (startTime <= now && (!endTime || endTime >= now)) {
    state = "ACTIVE";
    } else if (startTime > now) {
    state = "UPCOMING";
    } else if (endTime && endTime < now) {
    state = "EXPIRED";
    }
    console.log("sessionData: ",sessionData," state: ",state);
    return {
        exists: true,
        state,
        session: sessionData
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

  // 2️⃣ Fetch latest VALID session for this student
  const { data: sessionData, error: sessionError } = await supabase
    .from("session")
    .select("*")
    .eq("t_id", t_id)
    .eq("status", "VALID")
    .order("start_time", { ascending: true })
    .limit(1)
    .maybeSingle(); // safer than single()

  if (sessionError) {
    throw new Error("Failed to fetch session");
  }

  if (!sessionData) {
    return { exists: false };
  }

    const now = new Date();
    const startTime = new Date(sessionData.start_time);
    const endTime = sessionData.end_time ? new Date(sessionData.end_time) : null;

    let state = "INACTIVE";

    if (startTime <= now && (!endTime || endTime >= now)) {
    state = "ACTIVE";
    } else if (startTime > now) {
    state = "UPCOMING";
    } else if (endTime && endTime < now) {
    state = "EXPIRED";
    }
    console.log("sessionData: ",sessionData);
    return {
        exists: true,
        state,
        session: sessionData
    };
}

export async function sessionHistory(uid){
    const s_id = await getStudentIdByUid(uid);
    const bookingIds = await getBookingIdsByStudentId(s_id);
    if (!bookingIds.length) {
        return { session: [] };
    }

    // 2️⃣ Fetch latest VALID session for this student
    const { data: sessionData, error: sessionError } = await supabase
        .from("session")
        .select("*")
        .in("booking_id", bookingIds)
        .order("start_time", { ascending: false })

    if (sessionError) {
        throw new Error("Failed to fetch session");
    }
    return {
        session: sessionData
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

  return {
    ...data,
    s_id: booking.s_id,
  };
}
