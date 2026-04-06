import { callClaude } from "./claudeProvider.js";
import { buildContext, saveMessage } from "../context/contextBuilder.js";

const DEFAULT_SYSTEM = `
You are the AlgoNest AI Build Companion — an expert engineering tutor.
YOUR ONE HARD RULE: Don't write complete code intially for the student. Do Scaffold thinking.
If a student is genuinely stuck after trying, give a partial pattern with blanks to fill and then code. 
Try to give answers in pointers.
Ask one focused question at a time. Be crisp — max 3 sentences unless explaining a concept.
`.trim();

export async function generateAIResponse({ uid, message, systemPrompt, history, lessonId = null }) {
  console.log("AI_PROVIDER value:", JSON.stringify(process.env.AI_PROVIDER));

  // 1. Build context from DB (student info + recent history). It returns past 15 message and about student.
  const context = await buildContext(uid);

  // 2. Save the student's message immediately
  //    Don't wait until after Claude responds — if something fails mid-way,
  //    we still have the user message saved
  await saveMessage(uid, "user", message, lessonId);

  // 3. Assemble system prompt
  const fullSystemPrompt = `${systemPrompt || DEFAULT_SYSTEM}

--- Student Profile ---
Name: ${context.student?.name ?? "Student"}
Education: ${context.student?.education ?? "Not provided"}

--- Student Context ---
Project: hardcoded for now — replace with real project name from DB in P2
Current lesson: will come from lesson_progress in P2

--- Conversation History ---
${
  context.recentHistory.length > 0
    ? context.recentHistory
        .map(m => `${m.role === "user" ? "Student" : "Companion"}: ${m.content}`)
        .join("\n")
    : "No prior conversation."
}
`.trim();

  // 4. Call Claude
  //    Note: we pass history from the frontend as a fallback for the very
  //    first message when DB history is empty, but DB history is the source
  //    of truth from message 2 onwards
  const reply = await callClaude({
    systemPrompt: fullSystemPrompt,
    history: [],   // history is now baked into the system prompt above
    message,
  });

  // 5. Save Claude's response
  await saveMessage(uid, "assistant", reply, lessonId);

  return reply;
}