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
  getCurrentLesson,
  getLessonProgress,
  getCheckpointProgress,
  getRecentMentorFeedbackEmbeddings,
  getStudentMemory,
  getStudentCourse,
  searchRelevantMessages,
  searchRelevantFeedback,
} from './studentDataLayer.js';
import { getEmbedding } from './embeddingService.js';

function compact(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function formatLessonProgress(rows) {
  if (!rows?.length) return '';

  return rows.map((row, index) => {
    const lesson = row.lessons || {};
    const title = compact(lesson.title) || `Lesson #${row.lesson_id}`;
    const status = row.completed ? 'completed' : 'not completed';
    const quiz = row.quiz_attempt
      ? `, quiz: ${row.quiz_passed ? 'passed' : 'not passed'}${row.quiz_marks == null ? '' : ` (${row.quiz_marks})`}`
      : '';
    return `${index + 1}. ${title}: ${status}${quiz}`;
  }).join('\n');
}

function formatCheckpointProgress(rows) {
  if (!rows?.length) return '';

  return rows.map((row, index) => {
    const checkpoint = row.checkpoints || {};
    const title = compact(checkpoint.title) || `Checkpoint #${row.checkpoint_id}`;
    const status = compact(row.status) || (row.completed ? 'COMPLETED' : 'BOOKED');
    return `${index + 1}. ${title}: ${status}, completed=${row.completed ? 'true' : 'false'}, session=${row.session_id || 'none'}`;
  }).join('\n');
}

function buildSystemPromptSections({ selectedCourse, currentLesson, lessonProgress, checkpointProgress, memory, feedbackText }) {
  const sections = [
    [
      'RAG instruction:',
      'Use the current RAG context below as authoritative for mentor feedback, checkpoints, and lesson progress.',
      'If older chat history conflicts with this context, ignore the older assistant message.',
    ].join('\n'),
  ];

  if (selectedCourse) {
    sections.push([
      'Selected roadmap:',
      `Title: ${compact(selectedCourse.title) || `Course #${selectedCourse.course_id}`}`,
      `Domain: ${compact(selectedCourse.domain) || 'not set'}`,
    ].join('\n'));
  }

  const lessonLines = formatLessonProgress(lessonProgress);
  if (currentLesson || lessonLines) {
    sections.push([
      'Lesson progress:',
      currentLesson
        ? `Current lesson: ${compact(currentLesson.title) || `Lesson #${currentLesson.lesson_id}`}`
        : 'Current lesson: not found',
      lessonLines ? `Lessons:\n${lessonLines}` : '',
    ].filter(Boolean).join('\n'));
  }

  const checkpointLines = formatCheckpointProgress(checkpointProgress);
  if (checkpointLines) {
    sections.push([
      'Checkpoint progress:',
      checkpointLines,
    ].join('\n'));
  }

  if (memory?.summary && memory.summary !== 'No durable student memory summarized yet.') {
    sections.push([
      'Student long-term memory:',
      memory.summary,
      memory.strong_topics?.length ? `Strong topics: ${memory.strong_topics.join(', ')}` : '',
      memory.weak_topics?.length ? `Weak topics: ${memory.weak_topics.join(', ')}` : '',
      memory.learning_style ? `Learning style: ${memory.learning_style}` : '',
    ].filter(Boolean).join('\n'));
  }

  if (feedbackText) {
    sections.push(`Relevant mentor feedback and checkpoint embeddings:\n${feedbackText}`);
  }

  return sections.join('\n\n');
}

function mergeFeedbackRows(...groups) {
  const seen = new Set();
  const rows = [];

  for (const group of groups) {
    for (const row of group || []) {
      const key = row.feedback_embed_id
        ? `id:${row.feedback_embed_id}`
        : `${row.source || ''}:${row.session_id || ''}:${row.feedback_text || row.summary || ''}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push(row);
    }
  }

  return rows;
}

function formatFeedbackRows(rows) {
  return (rows || [])
    .map((f, i) => {
      const source = f.source || 'mentor_feedback';
      const text = f.feedback_text || f.summary || f.content || f.text || '';
      return text ? `${i + 1}. (${source}) ${text}` : '';
    })
    .filter(Boolean)
    .join('\n');
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
    lessonProgress: [],
    checkpointProgress: [],
    recentFeedback: [],
    memory: null,
    nextTopic: null,
    selectedCourse: null,
  };

  const student = await fetchStudent(uid);
  const recentHistory = await fetchRecentHistory(sId, 15);

  try {
    const [currentLesson, lessonProgress, checkpointProgress, recentFeedback, memory, selectedCourse] = await Promise.all([
      getCurrentLesson(sId),
      getLessonProgress(sId),
      getCheckpointProgress(sId),
      getRecentMentorFeedbackEmbeddings(sId),
      getStudentMemory(sId),
      getStudentCourse(sId),
    ]);

    ragContext.currentLesson = currentLesson || null;
    ragContext.lessonProgress = lessonProgress || [];
    ragContext.checkpointProgress = checkpointProgress || [];
    ragContext.recentFeedback = recentFeedback || [];
    ragContext.memory = memory || null;
    ragContext.selectedCourse = selectedCourse || null;

    // Semantic search: embed the incoming message and search similar messages
    let semanticFeedback = [];
    if (message && message.trim()) {
      try {
        const qEmbedding = await getEmbedding(message);
        const [sem, feedback] = await Promise.all([
          searchRelevantMessages(sId, qEmbedding, 6),
          searchRelevantFeedback(sId, qEmbedding, 3),
        ]);
        // sem items expected to have content and role
        ragContext.history = (sem || []).map((m) => ({ role: m.role || 'assistant', content: m.content || m.text || '' }));
        semanticFeedback = feedback || [];

      } catch (err) {
        console.error('contextBuilder.semantic search error:', err?.message || err);
      }
    }

    ragContext.relevantFeedback = mergeFeedbackRows(semanticFeedback, ragContext.recentFeedback);
    const feedbackText = formatFeedbackRows(ragContext.relevantFeedback);

    ragContext.systemPrompt = buildSystemPromptSections({
      selectedCourse: ragContext.selectedCourse,
      currentLesson: ragContext.currentLesson,
      lessonProgress: ragContext.lessonProgress,
      checkpointProgress: ragContext.checkpointProgress,
      memory: ragContext.memory,
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
      lessonProgressRows: ragContext.lessonProgress.length,
      checkpointProgressRows: ragContext.checkpointProgress.length,
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
    lessonProgress: ragContext?.lessonProgress || [],
    checkpointProgress: ragContext?.checkpointProgress || [],
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
