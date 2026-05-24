import { generateAIResponse } from "../services/ai/aiOrchestrator.js";
import { fetchHistoryForClient } from "../services/context/contextBuilder.js";
import { resolveStudentRoadmapContext } from "../services/roadmapContext.js";

export async function handleAIMessage(req, res) {
  try {
    const { uid, message, systemPrompt, history = [], lessonId = null, courseId = null } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "uid is required." });
    }
    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const roadmapContext = await resolveStudentRoadmapContext({ uid });
    const selectedCourseId = roadmapContext?.roadmapCourseId || null;
    const resolvedDomain = roadmapContext?.domain || roadmapContext?.selectedCourse?.domain || roadmapContext?.activeCourse?.domain || null;
    const requestedCourseId = Number(courseId);

    if (!resolvedDomain) {
      return res.status(403).json({
        error: "Select a domain in your profile before using AI.",
      });
    }

    if (!Number.isFinite(requestedCourseId) || requestedCourseId <= 0) {
      return res.status(400).json({ error: "courseId is required." });
    }

    if (Number(selectedCourseId) !== requestedCourseId) {
      return res.status(403).json({
        error: "AI is only enabled for your selected roadmap.",
      });
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
