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
import { buildContext, saveMessage as saveConvMessage } from './contextBuilder.js';
import { saveMessage as saveEmbeddingMessage, saveMentorFeedback } from './messageStore.js';

export { buildContext }                        from './contextBuilder.js';
// expose the conv_history saveMessage (uid-based) as the default `saveMessage`
export const saveMessage = saveConvMessage;
// expose the embedding-backed message saver under a clear name
export { saveEmbeddingMessage, saveMentorFeedback };
export { maybeSummarize }                      from './memoryService.js';
export { markTopicComplete,
         maybeCompleteLesson }                 from './studentDataLayer.js';