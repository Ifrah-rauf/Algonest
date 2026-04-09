import { callClaude } from "./claudeProvider.js";

import {
  buildContext,
  saveMessage,
  saveEmbeddingMessage,
  maybeSummarize,
} from "../rag/index.js";

const DEFAULT_SYSTEM = `
You are the AlgoNest AI Build Companion — an expert engineering tutor.
YOUR ONE HARD RULE: Don't write complete code initially for the student. Do scaffold thinking.
If a student is genuinely stuck after trying, give a partial pattern with blanks to fill and then code. 
Try to give answers in pointers.
Ask one focused question at a time. Be crisp — max 3 sentences unless explaining a concept.
`.trim();

export async function generateAIResponse({
  uid,
  message,
  systemPrompt,
  lessonId = null
}) {
  console.log("AI_PROVIDER value:", JSON.stringify(process.env.AI_PROVIDER));

  // 1. Build FULL RAG context (IMPORTANT: pass message)
  const context = await buildContext(uid, message);

  // 2. Log RAG context info so we can see if RAG was used
  const usedRag = Boolean(context && Array.isArray(context.history) && context.history.length > 0);
  console.log("[RAG] buildContext result:", {
    sId: context?.sId ?? null,
    historyLength: context?.history?.length ?? 0,
    systemPromptPresent: Boolean(context?.systemPrompt),
    usedRag,
  });

  // 3. Save user message to conv_history and embeddings (if we have sId)
  await saveMessage(uid, "user", message, lessonId);
  if (context?.sId && typeof saveEmbeddingMessage === "function") {
    try {
      await saveEmbeddingMessage(context.sId, "user", message, lessonId);
      console.log("[RAG] Saved user embedding for sId", context.sId);
    } catch (err) {
      console.error("[RAG] saveEmbeddingMessage user error:", err?.message || err);
    }
  } else {
    console.warn("[RAG] Skipping embedding save for user — sId missing or saveEmbeddingMessage unavailable.");
  }

  // 3. Use RAG-generated system prompt
  const finalSystemPrompt =
    context.systemPrompt || systemPrompt || DEFAULT_SYSTEM;

  // 4. Call Claude with structured history from RAG
  const reply = await callClaude({
    systemPrompt: finalSystemPrompt,
    history: context.history || [],
    message,
  });

  // 5. Save assistant response (both conv_history and embeddings)
  await saveMessage(uid, "assistant", reply, lessonId);
  if (context?.sId && typeof saveEmbeddingMessage === "function") {
    try {
      await saveEmbeddingMessage(context.sId, "assistant", reply, lessonId);
      console.log("[RAG] Saved assistant embedding for sId", context.sId);
    } catch (err) {
      console.error("[RAG] saveEmbeddingMessage assistant error:", err?.message || err);
    }
  } else {
    console.warn("[RAG] Skipping embedding save for assistant — sId missing or saveEmbeddingMessage unavailable.");
  }

  // 6. Maintain memory (summaries / compression)
  // 6. Maintain memory (summaries / compression)
  try {
    // maybeSummarize expects a numeric sId and a provider function.
    // pass the resolved `sId` from buildContext and the same provider used for Claude.
    if (context?.sId) {
      await maybeSummarize(context.sId, callClaude);
    } else {
      console.warn('[RAG] maybeSummarize skipped: sId not available');
    }
  } catch (err) {
    console.error('[RAG] maybeSummarize error:', err?.message || err);
  }

  return reply;
}