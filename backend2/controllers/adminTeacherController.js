import {
  createTeacher,
  listTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
} from "../services/adminTeacherService.js";

export async function adminListTeachers(req, res) {
  try {
    const teachers = await listTeachers();
    res.json({ success: true, teachers });
  } catch (err) {
    console.error("adminListTeachers error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to load teachers" });
  }
}

export async function adminGetTeacher(req, res) {
  try {
    const teacher = await getTeacher(req.params.tId);
    if (!teacher) {
      return res.status(404).json({ success: false, error: "Teacher not found" });
    }
    res.json({ success: true, teacher });
  } catch (err) {
    console.error("adminGetTeacher error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to load teacher" });
  }
}

export async function adminCreateTeacher(req, res) {
  try {
    const result = await createTeacher(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    console.error("adminCreateTeacher error:", err);
    res.status(400).json({ success: false, error: err.message || "Failed to create teacher" });
  }
}

export async function adminUpdateTeacher(req, res) {
  try {
    const result = await updateTeacher(req.params.tId, req.body);
    res.json({ success: true, teacher: result });
  } catch (err) {
    console.error("adminUpdateTeacher error:", err);
    res.status(400).json({ success: false, error: err.message || "Failed to update teacher" });
  }
}

export async function adminDeleteTeacher(req, res) {
  try {
    const result = await deleteTeacher(req.params.tId);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("adminDeleteTeacher error:", err);
    res.status(400).json({ success: false, error: err.message || "Failed to delete teacher" });
  }
}
