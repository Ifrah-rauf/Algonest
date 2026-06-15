import { getProjectRecommendations } from "../services/projectservice.js";

export async function recommendProjects(req, res) {
  try {
    const { uid, courseId = null } = req.body;
    const projects = await getProjectRecommendations(uid, courseId);
    res.status(200).json({ success: true, projects });
  } catch (err) {
    console.error("Project recommendation failed:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}
