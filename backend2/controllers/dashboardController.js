import { getActiveCourse, getSessions } from "../services/dashboardServices.js";

export async function activeCourse(req, res) {
  try {
    const { uid } = req.params;
    const course = await getActiveCourse(uid);
    res.json({ success: true, course });
  } catch (err) {
    console.error("❌ activeCourse error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function sessions(req, res) {
  try {
    const { uid } = req.params;
    const sessionsData = await getSessions(uid);
    res.json({ success: true, sessions: sessionsData });
  } catch (err) {
    console.error("❌ sessions error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
