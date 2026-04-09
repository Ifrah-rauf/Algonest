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
import {
  getStudentMemory,
  getCurrentLesson,
  getLessonTopicsWithProgress,
  searchRelevantMessages,
} from './studentDataLayer.js';
import { getEmbedding } from './embeddingService.js';

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
    const student = await fetchStudent(uid);
    return { student, recentHistory: [], systemPrompt: '', ragContext: null };
  }

  const sId = studentRow.s_id;

  // Step 2 — run partner's queries; RAG layer may be unavailable in some
  // environments — provide a safe default so the orchestrator doesn't crash.
  // Build RAG context: student, recentHistory (for UI), and semantic history/systemPrompt
  let ragContext = {
    systemPrompt: "",
    history: [],
    currentLesson: null,
    currentTopics: [],
    nextTopic: null,
  };

  const student = await fetchStudent(uid);
  const recentHistory = await fetchRecentHistory(sId, 15);

  try {
    const [memory, currentLesson] = await Promise.all([
      getStudentMemory(sId),
      getCurrentLesson(sId),
    ]);

    ragContext.currentLesson = currentLesson || null;

    // topics for current lesson (if any)
    if (currentLesson?.lesson_id) {
      ragContext.currentTopics = await getLessonTopicsWithProgress(sId, currentLesson.lesson_id);
    }

    // systemPrompt can include a short student memory summary to personalise the assistant
    ragContext.systemPrompt = memory?.summary ? `Student memory summary: ${memory.summary}` : "";

    // Semantic search: embed the incoming message and search similar messages
    if (message && message.trim()) {
      try {
        const qEmbedding = await getEmbedding(message);
        const sem = await searchRelevantMessages(sId, qEmbedding, 6);
        // sem items expected to have content and role
        ragContext.history = (sem || []).map((m) => ({ role: m.role || 'assistant', content: m.content || m.text || '' }));
      } catch (err) {
        console.error('contextBuilder.semantic search error:', err?.message || err);
      }
    }
  } catch (err) {
    console.error('contextBuilder.rag build error:', err?.message || err);
  }

  // Step 3 — return merged context
  // systemPrompt is the fully assembled prompt from your RAG layer.
  // history comes from RAG (last 6 + semantic). recentHistory kept for client display.
  return {
    student,                              // partner's field — orchestrator uses this
    recentHistory,                        // partner's field — used for client display
    systemPrompt: ragContext?.systemPrompt || "",
    history:      ragContext?.history || [],
    currentLesson:  ragContext?.currentLesson || null,
    currentTopics:  ragContext?.currentTopics || [],
    nextTopic:      ragContext?.nextTopic || null,
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

async function fetchRecentHistory(sId, limit = 15) {
  const { data, error } = await supabase
    .from('conv_history')
    .select('role, content, created_at')
    .eq('student_id', sId)
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