import { supabase } from "../lib/supabase.js";

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
    s_id: studentIdFromAuth,
    t_id: teacherId,
    startTime,
    slotId
  };
}
export async function checkSessionData(uid) {

  // 1️⃣ Fetch student
  const { data: studentData, error: studentError } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .single();

  if (studentError || !studentData) {
    throw new Error("Student not found");
  }

  const s_id = studentData.s_id;

  // 2️⃣ Fetch latest VALID session for this student
  const { data: sessionData, error: sessionError } = await supabase
    .from("session")
    .select("*")
    .eq("s_id", s_id)
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
    const { data: studentData, error: studentError } = await supabase
        .from("student")
        .select("s_id")
        .eq("uid", uid)
        .single();

    if (studentError || !studentData) {
        throw new Error("Student not found");
    }

    const s_id = studentData.s_id;

    // 2️⃣ Fetch latest VALID session for this student
    const { data: sessionData, error: sessionError } = await supabase
        .from("session")
        .select("*")
        .eq("s_id", s_id)
        .order("start_time", { ascending: false })

    if (sessionError) {
        throw new Error("Failed to fetch session");
    }
    return {
        session: sessionData
    };
}

//addition
export async function scheduleSession(studentId, teacherId, type, startTime) {
  const { data, error } = await supabase
    .from("session")
    .insert({
      s_id: studentId,
      t_id: teacherId,
      session_type: type,
      start_time: startTime,
      status: "VALID"
    })
    .select()
    .single(); // return one object instead of array

  if (error) throw error;
  return data; // return the object directly
}

export async function markAttendance(sessionId, attended, markedByTeacher) {
  const { data, error } = await supabase
    .from("session")
    .update({
      attended,
      marked_by_teacher: markedByTeacher
    })
    .eq("session_id", sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
