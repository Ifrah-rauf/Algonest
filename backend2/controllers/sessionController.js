import { getSessionPreparationData,
  checkSessionData,
  sessionHistory,
  checkTSessionData,
  completeSessionData,
  // saveMentorFeedback
} from "../services/sessionService.js";
import { saveMentorFeedback } from "../services/rag/index.js";
export async function prepareSessionData(req, res) {
  try {
    const { slotId } = req.body;

    if (!slotId) {
      return res.status(400).json({ error: "slotId is required" });
    }

    const data = await getSessionPreparationData(slotId, req.user?.id); 
    // assuming you have auth middleware setting req.user

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error("Prepare Session Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function checkSession(req, res) {
  try {
    const { uid } = req.body;
    const data = await checkSessionData(uid); 
    console.log("CHECKSESSIONDATA result:", data);
    return res.status(200).json({
      success: true,
      message:"success",
      data:data,
    });

  } catch (error) {
    console.error("No Session found:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
export async function getSessionHistory(req, res) {
  try {
    const { uid } = req.body;
    const data = await sessionHistory(uid); 

    return res.status(200).json({
      success: true,
      message:"success",
      data:data,
    });

  } catch (error) {
    console.error("Error in finding history of sessions:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function checkTSession(req, res) {
  try {
    const { uid } = req.body;
    const data = await checkTSessionData(uid);
    console.log("CHECKTSESSIONDATA result:", data);
    return res.status(200).json({
      success: true,
      message: "success",
      data,
    });
  } catch (error) {
    console.error("No teacher session found:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//RAG+ROADMAP COMMIT
export async function completeSession(req, res) {
  try {
    const { id } = req.params;
    const { feedbackText, supportId } = req.body || {};

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "session id is required",
      });
    }

    const data = await completeSessionData({
      sessionId: Number(id),
      feedbackText,
    });

    if (feedbackText?.trim()) {
      await saveMentorFeedback(data.s_id, supportId || null, feedbackText, {
        sessionId: data.session_id,
        source: 'manual_feedback',
      });
      console.log("[RAG] Mentor feedback embedded for sId", data.s_id);
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("completeSession error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
