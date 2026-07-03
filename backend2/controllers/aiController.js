import { generateAIResponse, streamAIResponse } from "../services/ai/aiOrchestrator.js";
import { fetchHistoryForClient } from "../services/context/contextBuilder.js";
import { getRoadmapAccess, sendRoadmapAccessDenied } from "../services/roadmapAccessService.js";

function toAccessResponse(access) {
  return {
    success: true,
    allowed: access.allowed,
    reason: access.reason,
    message: access.message,
    hasActiveBooking: access.hasActiveBooking === true,
    promptCount: access.promptCount || 0,
    promptLimit: access.promptLimit || 10,
  };
}

export async function handleAIMessage(req, res) {
  try {
    const { uid, message, systemPrompt, history = [], lessonId = null, courseId = null, stream = false } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "uid is required." });
    }
    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const requestedCourseId = Number(courseId);

    if (!Number.isFinite(requestedCourseId) || requestedCourseId <= 0) {
      return res.status(400).json({ error: "courseId is required." });
    }

    const access = await getRoadmapAccess({ uid, courseId: requestedCourseId });
    if (!access.allowed) {
      return sendRoadmapAccessDenied(res, access);
    }

    if (stream) {
      res.status(200);
      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      res.flushHeaders?.();

      let completedReply = "";

      try {
        await streamAIResponse({
          uid,
          message,
          systemPrompt,
          history,
          lessonId,
          courseId: requestedCourseId,
          onText: async (delta, fullText) => {
            completedReply = fullText;
            res.write(`event: delta\ndata: ${JSON.stringify({ delta, text: fullText })}\n\n`);
          },
        });

        res.write(`event: done\ndata: ${JSON.stringify({ reply: completedReply })}\n\n`);
        return res.end();
      } catch (error) {
        console.error("AI Stream Error:", error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: "AI response failed." })}\n\n`);
        return res.end();
      }
    }

    const reply = await generateAIResponse({
      uid,
      message,
      systemPrompt,
      history,
      lessonId,   // optional — frontend sends this when student is on a specific lesson
      courseId: requestedCourseId,
    });

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("AI Controller Error:", error);
    return res.status(500).json({ error: "AI response failed." });
  }
}


export async function getHistory(req, res) {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "uid is required." });

    const history = await fetchHistoryForClient(uid, 50); // last 50 for display
    return res.status(200).json({ history });

  } catch (error) {
    console.error("getHistory error:", error);
    return res.status(500).json({ error: "Failed to fetch history." });
  }
}

export async function getAccessStatus(req, res) {
  try {
    const { uid, courseId } = req.body;
    if (!uid) return res.status(400).json({ success: false, error: "uid is required." });

    const requestedCourseId = Number(courseId);
    if (!Number.isFinite(requestedCourseId) || requestedCourseId <= 0) {
      return res.status(400).json({ success: false, error: "courseId is required." });
    }

    const access = await getRoadmapAccess({ uid, courseId: requestedCourseId });
    return res.status(200).json(toAccessResponse(access));
  } catch (error) {
    console.error("getAccessStatus error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch AI access status." });
  }
}

// export async function handleAIMessage(req, res) {
//   try {
//     const { uid, message, systemPrompt, history = [] } = req.body; // ← uid from body

//     if (!uid) {
//       return res.status(400).json({ error: "uid is required." });
//     }
//     if (!message?.trim()) {
//       return res.status(400).json({ error: "Message is required." });
//     }

//     const reply = await generateAIResponse({ uid, message, systemPrompt, history });

//     return res.status(200).json({ reply });

//   } catch (error) {
//     console.error("AI Controller Error:", error);
//     return res.status(500).json({ error: "AI response failed." });
//   }
// }
