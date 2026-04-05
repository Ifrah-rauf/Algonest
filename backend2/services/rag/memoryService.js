// backend2/services/rag/memoryService.js
// Automatically builds and updates a student's memory profile.
// Triggered in the background every 20 messages — never blocks a response.

import {
  getMessageCount,
  getOlderMessages,
  getStudentMemory,
  upsertStudentMemory,
} from './studentDataLayer.js';

const SUMMARIZE_EVERY = 20; // run at message 20, 40, 60, 80...
const KEEP_RECENT     = 6;  // never summarize the last 6 (they stay as live context)

// ─────────────────────────────────────────────────────────────────────────────
// maybeSummarize
// Your partner calls this at the end of every chat, fire-and-forget:
//   maybeSummarize(sId, claudeProvider).catch(console.error)
//
// provider = any function that accepts { systemPrompt, history, message }
// and returns a string. Your partner passes their existing claudeProvider.
// ─────────────────────────────────────────────────────────────────────────────

export async function maybeSummarize(sId, provider) {
  const total = await getMessageCount(sId);

  // Only runs at exact multiples of 20
  if (total === 0 || total % SUMMARIZE_EVERY !== 0) return;

  const olderMessages = await getOlderMessages(sId, KEEP_RECENT);
  if (!olderMessages.length) return;

  // Load existing memory so we extend it, not overwrite it
  const existing   = await getStudentMemory(sId);
  const prevSummary = existing?.summary       ?? 'No previous summary.';
  const prevWeak    = existing?.weak_topics   ?? [];
  const prevStrong  = existing?.strong_topics ?? [];

  const conversationText = olderMessages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n');

  const prompt = `You are analyzing a student's learning chatbot history to update their memory profile.

EXISTING MEMORY:
Summary: ${prevSummary}
Known weak topics: ${prevWeak.join(', ') || 'none'}
Known strong topics: ${prevStrong.join(', ') || 'none'}

NEW CONVERSATION TO ANALYZE:
${conversationText}

Look for:
- Topics they asked about repeatedly or struggled to understand (weak)
- Topics they grasped quickly or answered correctly (strong)
- How they prefer to learn (examples? step by step? quick answers?)
- Any frustration or confusion signals in their messages

Return ONLY valid JSON. No markdown. No explanation. No code fences:
{
  "summary": "3-5 sentences: what they studied, what they struggled with, what clicked, how they learn",
  "weak_topics": ["specific topic name"],
  "strong_topics": ["specific topic name"],
  "learning_style": "one sentence describing how they prefer to engage"
}`;

  try {
    const raw = await provider({
      systemPrompt: 'You are a precise memory summarizer. Output ONLY valid JSON.',
      history:      [],
      message:      prompt,
    });

    const clean  = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    await upsertStudentMemory(sId, {
      summary:                   parsed.summary,
      weak_topics:               parsed.weak_topics   ?? [],
      strong_topics:             parsed.strong_topics  ?? [],
      learning_style:            parsed.learning_style ?? null,
      messages_summarized_count: total,
    });

    console.log(`[RAG] Memory updated for student ${sId} at message #${total}`);
  } catch (err) {
    console.error('[RAG] Memory summarization failed for student', sId, ':', err.message);
  }
}