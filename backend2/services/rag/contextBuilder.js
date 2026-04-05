// backend2/services/context/contextBuilder.js
// ─────────────────────────────────────────────────────────────────────────────
// DROP-IN for your partner's existing contextBuilder.js
// Same exports, same function signatures — orchestrator needs zero changes.
//
// What changed:
//   buildContext(uid) now also calls the RAG layer and merges:
//     - course, lesson, topics, memory, mentor feedback, semantic search
//     - full system prompt ready for Claude
//
//   saveMessage, fetchHistoryForClient — kept exactly as they were.
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from '../../lib/supabase.js';
import { buildContext as buildRagContext } from '../rag/contextBuilder.js';

// ─────────────────────────────────────────────────────────────────────────────
// buildContext — called by aiOrchestrator on every message
// Signature unchanged: buildContext(uid)
// Now returns everything the orchestrator had before + full RAG context
// ─────────────────────────────────────────────────────────────────────────────

export async function buildContext(uid, message = '') {
  // Step 1 — resolve uid → s_id (partner's existing logic, unchanged)
  const { data: studentRow, error: resolveError } = await supabase
    .from('student')
    .select('s_id')
    .eq('uid', uid)
    .single();

  if (resolveError || !studentRow) {
    console.error('buildContext: could not resolve uid to s_id', resolveError?.message);
    // Fall back to partner's original light context so the app doesn't crash
    const [student, recentHistory] = await Promise.all([
      fetchStudent(uid),
      fetchRecentHistory(uid, 15),
    ]);
    return { student, recentHistory, systemPrompt: '', ragContext: null };
  }

  const sId = studentRow.s_id;

  // Step 2 — run partner's queries + RAG queries in parallel
  const [student, recentHistory, ragContext] = await Promise.all([
    fetchStudent(uid),
    fetchRecentHistory(uid, 15),
    buildRagContext(sId, message),   // ← your RAG layer
  ]);

  // Step 3 — return merged context
  // systemPrompt is the fully assembled prompt from your RAG layer.
  // history comes from RAG (last 6 + semantic). recentHistory kept for client display.
  return {
    student,                              // partner's field — orchestrator uses this
    recentHistory,                        // partner's field — used for client display
    systemPrompt: ragContext.systemPrompt, // ← NEW: ready-made prompt for Claude
    history:      ragContext.history,      // ← NEW: last 6 msgs (correct AI format)
    currentLesson:  ragContext.currentLesson,
    currentTopics:  ragContext.currentTopics,
    nextTopic:      ragContext.nextTopic,
    sId,                                  // ← expose sId so orchestrator can use it
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Everything below is UNCHANGED from your partner's original file
// ─────────────────────────────────────────────────────────────────────────────

async function fetchStudent(uid) {
  const { data, error } = await supabase
    .from('student')
    .select('s_id, name, bio, education')
    .eq('uid', uid)
    .single();

  if (error) {
    console.error('contextBuilder.fetchStudent error:', error.message);
    return null;
  }
  return data;
}

async function fetchRecentHistory(uid, limit = 15) {
  const { data: studentRow, error: studentError } = await supabase
    .from('student')
    .select('s_id')
    .eq('uid', uid)
    .single();

  if (studentError || !studentRow) return [];

  const { data, error } = await supabase
    .from('conv_history')
    .select('role, content, created_at')
    .eq('student_id', studentRow.s_id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('contextBuilder.fetchRecentHistory error:', error.message);
    return [];
  }

  return data.reverse();
}

// saveMessage — unchanged, still writes to conv_history (partner's table)
// Your RAG messageStore.js writes to chat_messages separately (with embeddings)
export async function saveMessage(uid, role, content, lessonId = null) {
  const { data: studentRow, error: studentError } = await supabase
    .from('student')
    .select('s_id')
    .eq('uid', uid)
    .single();

  if (studentError || !studentRow) {
    console.error('saveMessage: could not resolve student for uid', uid);
    return;
  }

  const { error } = await supabase.from('conv_history').insert({
    student_id: studentRow.s_id,
    lesson_id:  lessonId ?? null,
    role,
    content,
  });

  if (error) console.error('saveMessage error:', error.message);
}

// fetchHistoryForClient — unchanged
export async function fetchHistoryForClient(uid, limit = 50) {
  const { data: studentRow } = await supabase
    .from('student')
    .select('s_id')
    .eq('uid', uid)
    .single();

  if (!studentRow) return [];

  const { data, error } = await supabase
    .from('conv_history')
    .select('role, content, created_at')
    .eq('student_id', studentRow.s_id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data.reverse();
}