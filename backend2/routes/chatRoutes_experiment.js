// const express = require('express');
// const router  = express.Router();
// import { supabase } from "../lib/supabase.js";

// import {
//   buildContext,
//   saveMessage,
//   saveMentorFeedback,
//   maybeSummarize,
//   markTopicComplete,
//   maybeCompleteLesson
// } from '../rag';

// // Your Track A AI adapters — adjust the path to match your project
// // Each adapter must accept { systemPrompt, history, message } and return a string
// import adapters from '../adapters/index.js';

// // ─────────────────────────────────────────────────────────────────────────────
// // POST /chat/:sId
// // Main chat endpoint. Called on every student message.
// // ─────────────────────────────────────────────────────────────────────────────

// router.post('/:sId', async (req, res) => {
//   const sId     = parseInt(req.params.sId);
//   const { message } = req.body;

//   if (!message?.trim()) {
//     return res.status(400).json({ error: 'Message cannot be empty' });
//   }

//   try {
//     // 1. Get the student's assigned AI bot from DB
//     const { data: student, error: studentError } = await supabase
//       .from('student')
//       .select('assigned_bot, name')
//       .eq('s_id', sId)
//       .single();

//     if (studentError || !student) {
//       return res.status(404).json({ error: 'Student not found' });
//     }

//     const bot = student.assigned_bot || 'claude';

//     // 2. Save the student's message with embedding
//     await saveMessage(sId, 'user', message);

//     // 3. Build the full context — all DB layers assembled into one system prompt
//     const { systemPrompt, history, currentLesson, nextTopic } =
//       await buildContext(sId, message);

//     // 4. Call the assigned AI (Track A provides the adapter)
//     const rawReply = await adapters[bot]({ systemPrompt, history, message });

//     // 5. Detect topic completion signal from the AI reply
//     //    The AI is instructed to append "TOPIC_COMPLETE:123" when a topic is done.
//     const topicMatch = rawReply.match(/TOPIC_COMPLETE:(\d+)/);
//     const cleanReply = rawReply.replace(/TOPIC_COMPLETE:\d+/g, '').trim();

//     if (topicMatch) {
//       const completedTopicId = parseInt(topicMatch[1]);
//       console.log(`[Progress] Student ${sId} completed topic ${completedTopicId}`);

//       await markTopicComplete(sId, completedTopicId);

//       if (currentLesson) {
//         const lessonDone = await maybeCompleteLesson(sId, currentLesson.lesson_id);
//         if (lessonDone) {
//           console.log(`[Progress] Student ${sId} completed lesson ${currentLesson.lesson_id}`);
//         }
//       }
//     }

//     // 6. Save the AI reply with embedding + lesson/topic tags
//     await saveMessage(
//       sId,
//       'assistant',
//       cleanReply,
//       currentLesson?.lesson_id ?? null,
//       nextTopic?.topic_id      ?? null
//     );

//     // 7. Trigger memory summarization in the background — never block the response
//     maybeSummarize(sId, adapters.claude).catch(err =>
//       console.error('[Memory] Background summarize failed:', err.message)
//     );

//     // 8. Return the clean reply to the frontend
//     return res.json({ reply: cleanReply });

//   } catch (err) {
//     console.error('Chat route error for student', sId, ':', err);
//     return res.status(500).json({ error: 'Something went wrong. Please try again.' });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // PATCH /chat/support/:supportId/complete
// // Called by the teacher dashboard when marking a support session complete.
// // Embeds the feedback text so the AI can find it later via semantic search.
// // ─────────────────────────────────────────────────────────────────────────────

// router.patch('/support/:supportId/complete', async (req, res) => {
//   const { supportId }        = req.params;
//   const { description, sId } = req.body;

//   if (!sId) {
//     return res.status(400).json({ error: 'sId is required' });
//   }

//   try {
//     // Mark session complete in DB
//     const { error } = await supabase
//       .from('support_stages')
//       .update({ completed: true, marked_by_teacher: true })
//       .eq('support_id', parseInt(supportId));

//     if (error) throw error;

//     // Embed and store the feedback text for future RAG search
//     if (description?.trim()) {
//       await saveMentorFeedback(parseInt(sId), parseInt(supportId), description);
//     }

//     return res.json({ success: true });

//   } catch (err) {
//     console.error('Support complete route error:', err);
//     return res.status(500).json({ error: 'Failed to mark support session complete' });
//   }
// });

// export default router;