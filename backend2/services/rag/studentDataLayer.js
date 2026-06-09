
// All database queries for the RAG layer.


import {supabase} from '../../lib/supabase.js';
import { resolveStudentRoadmapContext } from '../roadmapContext.js';
import { saveCheckpointEmbedding } from './saveFeedback.js';

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT
// ─────────────────────────────────────────────────────────────────────────────

export async function getStudentProfile(sId) {
  const { data, error } = await supabase
    .from('student')
    .select('*')
    .eq('s_id', sId)
    .single();

  if (error) throw new Error(`Student not found: ${error.message}`);
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// COURSE — what course is this student enrolled in
// Adjust 'student_courses' to your actual enrollment table name
// ─────────────────────────────────────────────────────────────────────────────

export async function getStudentCourse(sId) {
  const context = await resolveStudentRoadmapContext({ sId });
  return context.selectedCourse ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// CURRENT LESSON — the lesson that is started but not yet completed
// ─────────────────────────────────────────────────────────────────────────────

export async function getCurrentLesson(sId) {
  const { data } = await supabase
    .from('lesson_progress')
    .select(`
      progress_id,
      completed,
      lessons ( lesson_id, title, order_index )
    `)
    .eq('s_id', sId)
    .eq('completed', false)
    .order('lesson_id', { ascending: true })
    .limit(1)
    .maybeSingle();

  return data?.lessons ?? null;
}

export async function getLessonProgress(sId, limit = 20) {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select(`
      progress_id,
      lesson_id,
      completed,
      completed_at,
      quiz_marks,
      quiz_passed,
      quiz_attempt,
      ready_to_unlock,
      lessons ( lesson_id, title, order_index )
    `)
    .eq('s_id', sId)
    .order('lesson_id', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('[RAG] getLessonProgress error:', error.message || error);
    return [];
  }

  return data ?? [];
}

export async function getCheckpointProgress(sId, limit = 10) {
  const { data, error } = await supabase
    .from('checkpoints_progress')
    .select(`
      id,
      checkpoint_id,
      session_id,
      status,
      completed,
      completed_at,
      created_at,
      checkpoints ( checkpoint_id, title, description )
    `)
    .eq('s_id', sId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[RAG] getCheckpointProgress error:', error.message || error);
    return [];
  }

  return data ?? [];
}

export async function getRecentMentorFeedbackEmbeddings(sId, limit = 5) {
  const { data, error } = await supabase
    .from('mentor_feedback_embeddings')
    .select(`
      feedback_embed_id,
      session_id,
      support_id,
      s_id,
      feedback_text,
      summary,
      status,
      source,
      created_at
    `)
    .eq('s_id', sId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[RAG] getRecentMentorFeedbackEmbeddings error:', error.message || error);
    return [];
  }

  return data ?? [];
}

export async function markCheckpointComplete(checkpointId, sId, sessionId) {
  const { data, error } = await supabase
    .from('checkpoints_progress')
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
      status: 'COMPLETED',
    })
    .eq('checkpoint_id', checkpointId)
    .eq('s_id', sId)
    .eq('session_id', sessionId)
    .select('*')
    .single();

  if (error) {
    console.error('[RAG] markCheckpointComplete error:', error.message || error);
    throw error;
  }

  await saveCheckpointEmbedding(data);
  return data;
}

export async function markSessionCheckpointComplete(sessionId, sId) {
  if (!sessionId || !sId) return null;

  const { data: checkpoint, error } = await supabase
    .from('checkpoints_progress')
    .select('checkpoint_id, s_id, session_id')
    .eq('session_id', sessionId)
    .eq('s_id', sId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[RAG] markSessionCheckpointComplete lookup error:', error.message || error);
    return null;
  }
  if (!checkpoint?.checkpoint_id) return null;

  try {
    return await markCheckpointComplete(checkpoint.checkpoint_id, checkpoint.s_id, checkpoint.session_id);
  } catch (err) {
    console.error('[RAG] markSessionCheckpointComplete update error:', err?.message || err);
    return null;
  }
}

// // ─────────────────────────────────────────────────────────────────────────────
// // LESSON TOPICS WITH PROGRESS
// // Two separate queries merged in JS — Supabase cannot filter a left-joined
// // table with .eq() directly, so this is the correct approach.
// // ─────────────────────────────────────────────────────────────────────────────

// export async function getLessonTopicsWithProgress(sId, lessonId) {
//   const { data: topics, error } = await supabase
//     .from('lesson_topics')
//     .select('topic_id, title, description, applied_task, ai_note')
//     .eq('lesson_id', lessonId)
//     .order('topic_id', { ascending: true });

//   if (error || !topics?.length) return [];

//   const topicIds = topics.map((t) => t.topic_id);

//   const { data: progress } = await supabase
//     .from('lesson_topics_progress')
//     .select('topic_id, completed, completed_at')
//     .eq('s_id', sId)
//     .in('topic_id', topicIds);

//   const progressMap = Object.fromEntries(
//     (progress ?? []).map((p) => [p.topic_id, p]),
//   );

//   return topics.map((t) => ({
//     topic_id:     t.topic_id,
//     title:        t.title,
//     description:  t.description,
//     applied_task: t.applied_task,
//     ai_note:      t.ai_note,
//     completed:    progressMap[t.topic_id]?.completed    ?? false,
//     completed_at: progressMap[t.topic_id]?.completed_at ?? null,
//   }));
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // MARK TOPIC COMPLETE — called when AI signals it's done
// // ─────────────────────────────────────────────────────────────────────────────

// export async function markTopicComplete(sId, topicId) {
//   const { error } = await supabase
//     .from('lesson_topics_progress')
//     .upsert(
//       {
//         s_id:         sId,
//         topic_id:     topicId,
//         completed:    true,
//         completed_at: new Date().toISOString(),
//       },
//       { onConflict: 's_id,topic_id' },
//     );

//   if (error) console.error('markTopicComplete error:', error.message);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // MAYBE COMPLETE LESSON — if all topics are done, mark the lesson done too
// // ─────────────────────────────────────────────────────────────────────────────

// export async function maybeCompleteLesson(sId, lessonId) {
//   const topics  = await getLessonTopicsWithProgress(sId, lessonId);
//   const allDone = topics.length > 0 && topics.every((t) => t.completed);

//   if (allDone) {
//     const { error } = await supabase
//       .from('lesson_progress')
//       .update({ completed: true, completed_at: new Date().toISOString() })
//       .eq('s_id', sId)
//       .eq('lesson_id', lessonId);

//     if (error) console.error('maybeCompleteLesson error:', error.message);
//     else console.log(`[RAG] Student ${sId} completed lesson ${lessonId}`);
//   }

//   return allDone;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // COMPLETED LESSONS — full history of finished lessons
// // ─────────────────────────────────────────────────────────────────────────────

// export async function getCompletedLessons(sId) {
//   const { data } = await supabase
//     .from('lesson_progress')
//     .select(`lesson_id, completed_at, lessons ( title )`)
//     .eq('s_id', sId)
//     .eq('completed', true)
//     .order('completed_at', { ascending: true });

//   return data ?? [];
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // MENTOR SUPPORT SESSIONS — teacher feedback about this student
// // ─────────────────────────────────────────────────────────────────────────────

// export async function getCompletedSupportSessions(sId) {
//   const { data } = await supabase
//     .from('support_stages')
//     .select(`
//       support_id, title, description,
//       scheduled_at, marked_by_teacher,
//       lessons ( title )
//     `)
//     .eq('s_id', sId)
//     .eq('completed', true)
//     .order('scheduled_at', { ascending: false })
//     .limit(10);

//   return data ?? [];
// }

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT MEMORY — weak topics, strong topics, learning style, summary
// ─────────────────────────────────────────────────────────────────────────────

export async function getStudentMemory(sId) {
  const { data } = await supabase
    .from('student_memory')
    .select('*')
    .eq('s_id', sId)
    .maybeSingle();

  return data ?? null;
}

export async function upsertStudentMemory(sId, memoryData) {
  const { error } = await supabase
    .from('student_memory')
    .upsert(
      { s_id: sId, ...memoryData, last_updated: new Date().toISOString() },
      { onConflict: 's_id' },
    );

  if (error) {
    console.error('upsertStudentMemory error:', error.message);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGES — recent chat history + older messages for summarization
// ─────────────────────────────────────────────────────────────────────────────

export async function getRecentMessages(sId, limit = 6) {
  const { data } = await supabase
    .from('chat_messages')
    .select('role, content')
    .eq('s_id', sId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data ?? []).reverse(); // oldest first — correct order for AI
}

export async function getMessageCount(sId) {
  const { count } = await supabase
    .from('chat_messages')
    .select('message_id', { count: 'exact', head: true })
    .eq('s_id', sId);

  return count ?? 0;
}

export async function getOlderMessages(sId, skipLast = 6) {
  const total = await getMessageCount(sId);
  if (total <= skipLast) return [];

  const { data } = await supabase
    .from('chat_messages')
    .select('role, content, created_at')
    .eq('s_id', sId)
    .order('created_at', { ascending: true })
    .range(0, total - skipLast - 1);

  return data ?? [];
}

// ─────────────────────────────────────────────────────────────────────────────
// VECTOR SEARCH — semantic similarity via pgvector RPCs
// ─────────────────────────────────────────────────────────────────────────────

export async function searchRelevantMessages(sId, queryEmbedding, count = 5) {
  const { data, error } = await supabase.rpc('match_student_messages', {
    query_embedding: queryEmbedding,
    student_id:      sId,
    match_count:     count,
  });

  if (error) {
    console.error('[RAG] searchRelevantMessages RPC error:', error.message || error);
    return [];
  }

  const results = data ?? [];
  console.log(`[RAG] searchRelevantMessages: found ${results.length} candidates for sId=${sId}`);

  // Lower similarity threshold — 0.72 is very strict for semantic matches from different models.
  const threshold = parseFloat(process.env.RAG_SIMILARITY_THRESHOLD || '0.50');
  const filtered = results.filter((m) => (m.similarity ?? 0) >= threshold);
  console.log(`[RAG] searchRelevantMessages: ${filtered.length} passed threshold ${threshold}`);
  return filtered;
}

export async function searchRelevantFeedback(sId, queryEmbedding, count = 3) {
  const { data, error } = await supabase.rpc('match_mentor_feedback', {
    query_embedding: queryEmbedding,
    student_id:      sId,
    match_count:     count,
  });

  if (error) {
    console.error('[RAG] searchRelevantFeedback RPC error:', error.message || error);
    return [];
  }

  const results = data ?? [];
  console.log(`[RAG] searchRelevantFeedback: found ${results.length} candidates for sId=${sId}`);

  const threshold = parseFloat(process.env.RAG_FEEDBACK_SIMILARITY_THRESHOLD || '0.72');
  const filtered = results.filter((f) => (f.similarity ?? 0) >= threshold);
  console.log(`[RAG] searchRelevantFeedback: ${filtered.length} passed threshold ${threshold}`);
  return filtered;
}
