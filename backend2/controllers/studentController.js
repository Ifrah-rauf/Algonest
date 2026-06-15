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

import { saveProjectDetails, saveSelectedRoadmap } from "../services/studentService.js";

export async function updateSelectedRoadmap(req, res) {
  try {
    const { studentId, courseId } = req.body;
    const result = await saveSelectedRoadmap(studentId, courseId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateProjectDetails(req, res) {
  try {
    const { studentId, projectTitle, projectId = null } = req.body;
    if (!projectTitle) {
      return res.status(400).json({ success: false, message: "Project title is required" });
    }
    const result = await saveProjectDetails(studentId, projectTitle, projectId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
