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
  getStudentCourse,
  searchRelevantMessages,
  searchRelevantFeedback,
} from './studentDataLayer.js';
import { getEmbedding } from './embeddingService.js';

function compact(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function buildSystemPromptSections({ student, memory, selectedCourse, currentLesson, currentTopics, feedbackText }) {
  const sections = [];

  if (student) {
    sections.push([
      'Student profile:',
      `Name: ${compact(student.name) || 'unknown'}`,
      `Bio: ${compact(student.bio) || 'not provided'}`,
      `Education: ${compact(student.education) || 'not provided'}`,
    ].join('\n'));
  }

  if (selectedCourse) {
    sections.push([
      'Selected roadmap:',
      `Title: ${compact(selectedCourse.title) || `Course #${selectedCourse.course_id}`}`,
      `Domain: ${compact(selectedCourse.domain) || 'not set'}`,
    ].join('\n'));
  }

  if (currentLesson) {
    const topicLines = (currentTopics || []).length
      ? currentTopics.map((topic, index) => {
          const status = topic.completed ? 'completed' : 'not completed';
          return `${index + 1}. ${compact(topic.title)} (${status})`;
        }).join('\n')
      : 'No current lesson topics found.';

    sections.push([
      'Lesson progress:',
      `Current lesson: ${compact(currentLesson.title) || `Lesson #${currentLesson.lesson_id}`}`,
      `Topics:\n${topicLines}`,
    ].join('\n'));
  }

  if (memory?.summary) {
    sections.push(`Student memory summary:\n${memory.summary}`);
  }

  if (feedbackText) {
    sections.push(`Relevant mentor feedback:\n${feedbackText}`);
  }

  return sections.join('\n\n');
}

function shouldLogRagPrompt() {
  return process.env.RAG_DEBUG_PROMPT === 'true' || process.env.NODE_ENV !== 'production';
}

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
    relevantFeedback: [],
    currentLesson: null,
    currentTopics: [],
    nextTopic: null,
    selectedCourse: null,
  };

  const student = await fetchStudent(uid);
  const recentHistory = await fetchRecentHistory(sId, 15);

  try {
    const [memory, currentLesson] = await Promise.all([
      getStudentMemory(sId),
      getCurrentLesson(sId),
    ]);

    ragContext.currentLesson = currentLesson || null;
    ragContext.selectedCourse = await getStudentCourse(sId);

    // topics for current lesson (if any)
    if (currentLesson?.lesson_id) {
      ragContext.currentTopics = await getLessonTopicsWithProgress(sId, currentLesson.lesson_id);
    }

    // Semantic search: embed the incoming message and search similar messages
    let feedbackText = '';
    if (message && message.trim()) {
      try {
        const qEmbedding = await getEmbedding(message);
        const [sem, feedback] = await Promise.all([
          searchRelevantMessages(sId, qEmbedding, 6),
          searchRelevantFeedback(sId, qEmbedding, 3),
        ]);
        // sem items expected to have content and role
        ragContext.history = (sem || []).map((m) => ({ role: m.role || 'assistant', content: m.content || m.text || '' }));
        ragContext.relevantFeedback = feedback || [];

        feedbackText = (feedback || [])
          .map((f) => f.feedback_text || f.content || f.text || '')
          .filter(Boolean)
          .map((text, index) => `${index + 1}. ${text}`)
          .join('\n');
      } catch (err) {
        console.error('contextBuilder.semantic search error:', err?.message || err);
      }
    }

    ragContext.systemPrompt = buildSystemPromptSections({
      student,
      memory,
      selectedCourse: ragContext.selectedCourse,
      currentLesson: ragContext.currentLesson,
      currentTopics: ragContext.currentTopics,
      feedbackText,
    });
  } catch (err) {
    console.error('contextBuilder.rag build error:', err?.message || err);
  }

  // Step 3 — return merged context
  // systemPrompt is the fully assembled prompt from your RAG layer.
  // history comes from RAG (last 6 + semantic). recentHistory kept for client display.
  if (shouldLogRagPrompt()) {
    console.log('[RAG] buildContext prompt inspection:', {
      sId,
      hasStudentProfile: Boolean(student),
      hasLessonProgress: Boolean(ragContext.currentLesson),
      relevantChatMessages: ragContext.history.length,
      relevantMentorFeedback: ragContext.relevantFeedback.length,
      systemPrompt: ragContext.systemPrompt,
      history: ragContext.history,
    });
  }

  return {
    student,                              // partner's field — orchestrator uses this
    recentHistory,                        // partner's field — used for client display
    systemPrompt: ragContext?.systemPrompt || "",
    history:      ragContext?.history || [],
    currentLesson:  ragContext?.currentLesson || null,
    currentTopics:  ragContext?.currentTopics || [],
    nextTopic:      ragContext?.nextTopic || null,
    selectedCourse: ragContext?.selectedCourse || null,
    domain:         ragContext?.selectedCourse?.domain || null,
    sId,                                  // ← expose sId so orchestrator can use it
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Everything below is UNCHANGED from your partner's original file
// ─────────────────────────────────────────────────────────────────────────────

async function fetchStudent(uid) {
  const { data, error } = await supabase
    .from('student')
    .select('s_id, name, bio, education, course_id')
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