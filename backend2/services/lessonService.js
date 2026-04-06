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
