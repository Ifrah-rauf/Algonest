import { generateAIResponse } from "../services/ai/aiOrchestrator.js";
import { fetchHistoryForClient } from "../services/context/contextBuilder.js";
import { resolveStudentRoadmapContext } from "../services/roadmapContext.js";
import { supabase } from "../lib/supabase.js";

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
    const student = roadmapContext?.student;
    const selectedCourseId = roadmapContext?.roadmapCourseId || null;
    const resolvedDomain = roadmapContext?.domain || roadmapContext?.selectedCourse?.domain || roadmapContext?.activeCourse?.domain || null;
    const requestedCourseId = Number(courseId);

    if (!resolvedDomain) {
      return res.status(403).json({
        error: "Select a domain in your profile before using AI.",
      });
    }

    // requirement: project title must be fed
    if (!student?.project_title) {
      return res.status(403).json({
        error: "Please feed your project title in your profile to enable AI Companion.",
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

    // requirement: 10 prompts limit if no booking
    if (roadmapContext.source !== "booking") {
      const { count, error: countError } = await supabase
        .from("conv_history")
        .select("*", { count: "exact", head: true })
        .eq("student_id", student.s_id)
        .eq("role", "user");

      if (countError) {
        console.error("Error counting prompts:", countError);
      } else if (count >= 10) {
        return res.status(403).json({
          error: "You have reached the 10-prompt limit for free users. Please book a plan to continue using AI Companion.",
        });
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
