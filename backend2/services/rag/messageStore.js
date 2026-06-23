
import {supabase}         from '../../lib/supabase.js';
import { getEmbedding } from './embeddingService.js';

// ─────────────────────────────────────────────────────────────────────────────
// saveMessage
// Called by your partner's aiOrchestrator BEFORE and AFTER every AI call.
// Saves user message + AI reply both with their embedding vectors.
// lessonId and topicId are optional
// ─────────────────────────────────────────────────────────────────────────────

export async function saveMessage(sId, role, content, lessonId = null, topicId = null) {
  const embedding = await getEmbedding(content);

  const { error } = await supabase.from('chat_messages').insert({
    s_id:      sId,
    role,        // 'user' | 'assistant'
    content,
    embedding,
    lesson_id: lessonId,
    topic_id:  topicId,
  });

  if (error) {
    console.error('[RAG] saveMessage error:', error.message);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// saveMentorFeedback
// Called when a teacher marks a support session complete.
// Embeds the feedback text so the AI can find it via semantic search later.
// ─────────────────────────────────────────────────────────────────────────────

export async function saveMentorFeedback(sId, supportId, feedbackText, options = {}) {
  if (!feedbackText?.trim()) return;

  const embedding = await getEmbedding(feedbackText);

  const { error } = await supabase.from('mentor_feedback_embeddings').insert({
    s_id:          sId,
    support_id:    supportId || null,
    session_id:    options.sessionId || null,
    feedback_text: feedbackText,
    embedding,
    source:        options.source || 'manual_feedback',
  });

  if (error) {
    console.error('[RAG] saveMentorFeedback error:', error.message);
    throw error;
  }
}
