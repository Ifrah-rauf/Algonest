
import {
  getMessageCount,
  getOlderMessages,
  getStudentMemory,
  upsertStudentMemory,
} from './studentDataLayer.js';

const SUMMARIZE_EVERY = 5;  // run at message 5, 10, 15, 20...
const KEEP_RECENT     = 6;  // never summarize the last 6 (they stay as live context)

export async function maybeSummarize(sId, provider) {
  const total = await getMessageCount(sId);

  // Only runs at exact multiples of SUMMARIZE_EVERY
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

Look for durable facts that should be remembered across future chats:
- Student experience, background, projects, tools, tech stack, goals, and preferences
- Topics they asked about repeatedly or struggled to understand (weak)
- Topics they grasped quickly or answered correctly (strong)
- How they prefer to learn (examples? step by step? quick answers?)
- Mentor feedback themes, checkpoint/project context, and action items mentioned in chat
- Any frustration, confidence, confusion, deadlines, or constraints

Return ONLY valid JSON. No markdown. No explanation. No code fences:
{
  "summary": "4-7 sentences preserving important durable student facts, experience, projects, goals, progress, struggles, and learning style",
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
