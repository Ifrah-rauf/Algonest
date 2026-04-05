import { supabase } from "../lib/supabase.js";

export async function listCheckpoints(studentId) {
  const { data, error } = await supabase
    .from("checkpoints")
    .select("*")
    .eq("s_id", studentId);
  if (error) throw error;
  return data;
}

export async function completeCheckpoint(checkpointId, studentId) {
  const { data, error } = await supabase
    .from("checkpoints")
    .update({
      status: "completed",
      completed: true,
      completed_at: new Date().toISOString(),
      marked_by_teacher: true
    })
    .eq("checkpoint_id", checkpointId)
    .eq("s_id", studentId)
    .select();
  if (error) throw error;
  return data[0];
}
