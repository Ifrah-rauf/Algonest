//import { getSessionPreparationData,checkSessionData,sessionHistory,scheduleSession,markAttendance } from "../services/sessionService.js";

import * as sessionService from "../services/sessionService.js";
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

//additional 


export async function createSession(req, res) {
  try {
    const { studentId, teacherId, type, startTime } = req.body;
    if (!studentId || !teacherId || !type || !startTime) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const { data, error } = await sessionService.scheduleSession(studentId, teacherId, type, startTime);
    if (error) return res.status(400).json({ success: false, message: error.message });

    res.status(201).json({ success: true, session: data[0] });
  } catch (err) {
    console.error("❌ createSession error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function updateAttendance(req, res) {
  try {
    const { sessionId } = req.params;
    const { attended, markedByTeacher } = req.body;
    if (!sessionId) return res.status(400).json({ success: false, message: "sessionId required" });

    const { data, error } = await sessionService.markAttendance(sessionId, attended, markedByTeacher);
    if (error) return res.status(400).json({ success: false, message: error.message });

    res.json({ success: true, session: data[0] });
  } catch (err) {
    console.error("❌ updateAttendance error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

