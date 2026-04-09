import { getCourseOutline, getLatestOutline, fetchPlans, fetchCourse } from "../services/planService.js";

export async function courseOutline(req, res) {
  try {
    const planId = Number(req.params.id);
    if (!planId) return res.status(400).json({ success: false, message: "Invalid plan id" });

    const data = await getCourseOutline(planId);
    if (!data) {
      return res.json({ success: true, outline: null, sessions: [], attachments: [], totalSessions: 0, remSessions: 0 });
    }
    res.json({ success: true, ...data });
  } catch (err) {
    console.error("❌ courseOutline error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getOutline(req, res) {
  try {
    const { uid } = req.params;
    if (!uid) return res.status(400).json({ success: false, message: "uid not provided" });

    const latestBooking = await getLatestOutline(uid);
    // plan_outline removed — return latest booking info if available
    res.json({ success: true, booking: latestBooking || null });
  } catch (err) {
    console.error("❌ getOutline error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getPlans(req, res) {
  try {
    const plans = await fetchPlans();
    res.json({ success: true, plans });
  } catch (err) {
    console.error("❌ plans fetch error:", err);
    res.status(500).json({ success: false });
  }
}
export async function getCourse(req, res) {
  try {
    const courses = await fetchCourse();
    res.json({ success: true, courses });
  } catch (err) {
    console.error("❌ plans fetch error:", err);
    res.status(500).json({ success: false });
  }
}