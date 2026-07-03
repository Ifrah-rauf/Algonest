import { callClaude, streamClaude } from "./claudeProvider.js";

import {
  buildContext,
  saveMessage,
  saveEmbeddingMessage,
  maybeSummarize,
} from "../rag/index.js";

const DEFAULT_SYSTEM = `
You are the AlgoNest AI Build Companion - an expert engineering tutor.
YOUR ONE HARD RULE: Don't write complete code initially for the student. Do scaffold thinking.
If a student is genuinely stuck after trying, give a partial pattern with blanks to fill and then code.
Try to give answers in pointers.
Ask one focused question at a time. Be crisp - max 3 sentences unless explaining a concept.
`.trim();

function shouldLogAiPrompt() {
  return process.env.RAG_DEBUG_PROMPT === "true" || process.env.NODE_ENV !== "production";
}

async function buildAiPrompt({
  uid,
  message,
  systemPrompt,
  courseId = null,
}) {
  const context = await buildContext(uid, message);

  const usedRag = Boolean(context && Array.isArray(context.history) && context.history.length > 0);
  console.log("[RAG] buildContext result:", {
    sId: context?.sId ?? null,
    historyLength: context?.history?.length ?? 0,
    systemPromptPresent: Boolean(context?.systemPrompt),
    usedRag,
    courseId,
  });

  const finalSystemPrompt = context.systemPrompt || systemPrompt || DEFAULT_SYSTEM;
  const selectedRoadmapLine = context?.selectedCourse
    ? `Selected roadmap: ${context.selectedCourse.title || `Course #${context.selectedCourse.course_id}`}`
    : context?.student?.course_id
      ? `Selected roadmap: Course #${context.student.course_id}`
      : "Selected roadmap: not set";
  const selectedDomainLine = context?.domain
    ? `Selected domain: ${context.domain}`
    : context?.selectedCourse?.domain
      ? `Selected domain: ${context.selectedCourse.domain}`
      : "Selected domain: not set";

  const expandedSystemPrompt = `${finalSystemPrompt}

--- Roadmap Selection ---
${selectedRoadmapLine}

--- Domain Selection ---
${selectedDomainLine}
`.trim();

  if (shouldLogAiPrompt()) {
    console.log("[RAG] Claude prompt inspection:", {
      systemPrompt: expandedSystemPrompt,
      messages: [
        ...(context.history || []).map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ],
    });
  }

  return {
    context,
    systemPrompt: expandedSystemPrompt,
    history: context.history || [],
  };
}

async function saveSuccessfulExchange({ uid, sId, message, reply, lessonId }) {
  await saveMessage(uid, "user", message, lessonId);

  if (sId && typeof saveEmbeddingMessage === "function") {
    try {
      await saveEmbeddingMessage(sId, "user", message, lessonId);
      console.log("[RAG] Saved user embedding for sId", sId);
    } catch (err) {
      console.error("[RAG] saveEmbeddingMessage user error:", err?.message || err);
    }
  } else {
    console.warn("[RAG] Skipping embedding save for user - sId missing or saveEmbeddingMessage unavailable.");
  }

  await saveMessage(uid, "assistant", reply, lessonId);

  if (sId && typeof saveEmbeddingMessage === "function") {
    try {
      await saveEmbeddingMessage(sId, "assistant", reply, lessonId);
      console.log("[RAG] Saved assistant embedding for sId", sId);
    } catch (err) {
      console.error("[RAG] saveEmbeddingMessage assistant error:", err?.message || err);
    }
  } else {
    console.warn("[RAG] Skipping embedding save for assistant - sId missing or saveEmbeddingMessage unavailable.");
  }
}

export async function generateAIResponse({
  uid,
  message,
  systemPrompt,
  lessonId = null,
  courseId = null,
}) {
  console.log("AI_PROVIDER value:", JSON.stringify(process.env.AI_PROVIDER));
  const { context, systemPrompt: expandedSystemPrompt, history } = await buildAiPrompt({
    uid,
    message,
    systemPrompt,
    courseId,
  });

  const reply = await callClaude({
    systemPrompt: expandedSystemPrompt,
    history,
    message,
  });

  await saveSuccessfulExchange({
    uid,
    sId: context?.sId,
    message,
    reply,
    lessonId,
  });

  try {
    if (context?.sId) {
      await maybeSummarize(context.sId, callClaude);
    } else {
      console.warn("[RAG] maybeSummarize skipped: sId not available");
    }
  } catch (err) {
    console.error("[RAG] maybeSummarize error:", err?.message || err);
  }

  return reply;
}

export async function streamAIResponse({
  uid,
  message,
  systemPrompt,
  lessonId = null,
  courseId = null,
  onText = async () => {},
}) {
  const { context, systemPrompt: expandedSystemPrompt, history } = await buildAiPrompt({
    uid,
    message,
    systemPrompt,
    courseId,
  });

  const stream = streamClaude({
    systemPrompt: expandedSystemPrompt,
    history,
    message,
  });

  let reply = "";
  stream.on("text", async (textDelta) => {
    reply += textDelta;
    await onText(textDelta, reply);
  });

  await stream.finalText();

  await saveSuccessfulExchange({
    uid,
    sId: context?.sId,
    message,
    reply,
    lessonId,
  });

  try {
    if (context?.sId) {
      await maybeSummarize(context.sId, callClaude);
    }
  } catch (err) {
    console.error("[RAG] maybeSummarize error:", err?.message || err);
  }

  return reply;
}
