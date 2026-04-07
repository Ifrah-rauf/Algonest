// backend2/services/rag/index.js
// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API — the only file your partner needs to import from.
//
// In aiOrchestrator.js (your partner's file):
//
//   import {
//     buildContext,
//     saveMessage,
//     saveMentorFeedback,
//     maybeSummarize,
//     markTopicComplete,
//     maybeCompleteLesson,
//   } from '../rag/index.js';
//
// That's the entire surface area. Nothing else is exposed.
// ─────────────────────────────────────────────────────────────────────────────

export { buildContext }                        from './contextBuilder.js';
export { saveMessage, saveMentorFeedback }     from './messageStore.js';
export { maybeSummarize }                      from './memoryService.js';
export { markTopicComplete,
         maybeCompleteLesson }                 from './studentDataLayer.js';