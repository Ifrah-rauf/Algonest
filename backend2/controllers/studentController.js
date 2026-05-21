// studentController.js
import { saveGithubLink } from "../services/studentService.js";

export async function updateGithub(req, res) {
  try {
    const { studentId, githubUrl } = req.body;
    const result = await saveGithubLink(studentId, githubUrl);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// controllers/studentController.js
import { saveResumeLink } from "../services/studentService.js";

export async function updateResume(req, res) {
  try {
    const { studentId, resumeUrl } = req.body;
    if (!resumeUrl) {
      return res.status(400).json({ success: false, message: "Resume URL is required" });
    }
    const result = await saveResumeLink(studentId, resumeUrl);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
