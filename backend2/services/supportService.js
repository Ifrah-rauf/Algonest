import { supabase } from "../lib/supabase.js";

export async function scheduleSupport(studentId, teacherId, lessonId, time) {
  return await supabase.from("support_stages").insert({
    s_id: studentId,
    lesson_id: lessonId,
    teacher_id: teacherId,
    scheduled_at: time,
    completed: false,
    marked_by_teacher: false
  }).select();
}

export async function listSupportSessions(studentId) {
  return await supabase.from("support_stages").select("*").eq("s_id", studentId);
}
