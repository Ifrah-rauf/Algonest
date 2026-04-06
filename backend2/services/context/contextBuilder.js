import { supabase } from "../../lib/supabase.js";

export async function buildContext(uid) {

  // Run both queries in parallel — don't wait for one before starting the other
  const [studentResult, historyResult] = await Promise.all([
    fetchStudent(uid),
    fetchRecentHistory(uid, 15),
  ]);

  return {
    student:       studentResult,
    recentHistory: historyResult,
    // memories: []  ← wire in after student_memories table is built (P2)
  };
}
// ── Fetch student by uid ───────────────────────────────────────────────────
async function fetchStudent(uid) {
  const { data, error } = await supabase
    .from("student")
    .select("s_id, name, bio, education")
    .eq("uid", uid)
    .single();

  if (error) {
    console.error("contextBuilder.fetchStudent error:", error.message);
    return null;
  }

  return data;
}

// ── Fetch last N messages for this student ─────────────────────────────────
async function fetchRecentHistory(uid, limit = 15) {
  // First resolve uid → s_id
  const { data: studentRow, error: studentError } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .single();

  if (studentError || !studentRow) return [];

  const { data, error } = await supabase
    .from("conv_history")
    .select("role, content, created_at")
    .eq("student_id", studentRow.s_id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("contextBuilder.fetchRecentHistory error:", error.message);
    return [];
  }

  // Reverse so oldest → newest (correct order for Claude's messages array)
  return data.reverse();
}

// ── Save a single message to conv_history ─────────────────────────────────
export async function saveMessage(uid, role, content, lessonId = null) {
  // Resolve uid → s_id
  const { data: studentRow, error: studentError } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .single();

  if (studentError || !studentRow) {
    console.error("saveMessage: could not resolve student for uid", uid);
    return;
  }

  const { error } = await supabase
    .from("conv_history")
    .insert({
      student_id: studentRow.s_id,
      lesson_id:  lessonId ?? null,
      role,
      content,
    });

  if (error) console.error("saveMessage error:", error.message);
}

// Fetches more messages for display (vs the 15 used for AI context)
export async function fetchHistoryForClient(uid, limit = 50) {
  const { data: studentRow } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .single();

  if (!studentRow) return [];

  const { data, error } = await supabase
    .from("conv_history")
    .select("role, content, created_at")
    .eq("student_id", studentRow.s_id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data.reverse();
}