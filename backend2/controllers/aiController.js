import { generateAIResponse } from "../services/ai/aiOrchestrator.js";
import { fetchHistoryForClient } from "../services/context/contextBuilder.js";

export async function handleAIMessage(req, res) {
  try {
    const { uid, message, systemPrompt, history = [], lessonId = null } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "uid is required." });
    }
    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const reply = await generateAIResponse({
      uid,
      message,
      systemPrompt,
      history,
      lessonId,   // optional — frontend sends this when student is on a specific lesson
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