import { supabase } from "../lib/supabase.js";

// LESSONS
export async function fetchLessons() {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data;
}

// LESSON TOPICS
export async function fetchLessonTopics() {
  const { data, error } = await supabase
    .from("lesson_topics")
    .select("*");

  if (error) throw error;
  return data;
}

export async function fetchLessonTopicMaterials() {
  const { data, error } = await supabase
    .from("lesson_topic_materials")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data;
}

// CHECKPOINTS
export async function fetchCheckpoints() {
  const { data, error } = await supabase
    .from("checkpoints")
    .select(`
      *,
      session:session_id (
        session_id,
        end_time,
        marked_by_teacher
      )
    `);

  if (error) throw error;
  return data;
}

export async function getCheckpointBookingStatus(checkpointId) {
  if (!checkpointId) {
    throw new Error("checkpointId is required");
  }

  const { data, error } = await supabase
    .from("checkpoints")
    .select(`
      checkpoint_id,
      title,
      session_id,
      session:session_id (
        session_id,
        start_time,
        end_time,
        marked_by_teacher
      )
    `)
    .eq("checkpoint_id", checkpointId)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error("Checkpoint not found");
  }

  const session = data.session || null;
  const now = new Date();
  const endTime = session?.end_time ? new Date(session.end_time) : null;
  const markedByTeacher = session?.marked_by_teacher === true;
  const cooldownEndsAt = endTime
    ? new Date(endTime.getTime() + 24 * 60 * 60 * 1000)
    : null;

  if (!data.session_id || !session) {
    return {
      checkpointId: data.checkpoint_id,
      sessionId: null,
      status: "AVAILABLE",
      canBook: true,
      disableReason: null,
      cooldownEndsAt: null,
    };
  }

  if (markedByTeacher) {
    return {
      checkpointId: data.checkpoint_id,
      sessionId: session.session_id,
      status: "COMPLETED",
      canBook: false,
      disableReason: "Checkpoint already completed.",
      cooldownEndsAt: null,
    };
  }

  if (!endTime || endTime > now) {
    return {
      checkpointId: data.checkpoint_id,
      sessionId: session.session_id,
      status: "AWAITING_COMPLETION",
      canBook: false,
      disableReason: "You already have a checkpoint session pending completion.",
      cooldownEndsAt: endTime ? endTime.toISOString() : null,
    };
  }

  if (cooldownEndsAt && now < cooldownEndsAt) {
    return {
      checkpointId: data.checkpoint_id,
      sessionId: session.session_id,
      status: "COOLDOWN",
      canBook: false,
      disableReason: "You can book another class for this checkpoint one day after the previous session expires.",
      cooldownEndsAt: cooldownEndsAt.toISOString(),
    };
  }

  return {
    checkpointId: data.checkpoint_id,
    sessionId: session.session_id,
    status: "REBOOK_ALLOWED",
    canBook: true,
    disableReason: null,
    cooldownEndsAt: cooldownEndsAt ? cooldownEndsAt.toISOString() : null,
  };
}

export async function getLessonById(lessonId) {
  const { data, error } = await supabase
    .from("lessons")
    .select("lesson_id, title, order_index, status")
    .eq("lesson_id", lessonId)
    .single();

  if (error) {
    console.error("getLessonById error:", error.message);
    return null;
  }

  return data;
}

export async function fetchLessonProgressByUid(uid) {
  if (!uid) return [];

  const { data: studentRow, error: studentError } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .maybeSingle();

  if (studentError) throw studentError;
  if (!studentRow?.s_id) return [];

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("s_id", studentRow.s_id);

  if (error) throw error;
  return data || [];
}

export async function attachSessionToCheckpoint({ checkpointId, sessionId }) {
  if (!checkpointId || !sessionId) {
    throw new Error("checkpointId and sessionId are required");
  }

  const { data, error } = await supabase
    .from("checkpoints")
    .update({ session_id: sessionId })
    .eq("checkpoint_id", checkpointId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
