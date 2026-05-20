import {
  fetchAllTeachers,
  fetchFilterMeta,
  fetchTeacherById,
  fetchMentors,
  getMentorsByDomain,
  checkIsOwner,
  saveTeacherAvailability
} from "../services/teacherService.js";

export async function getAllTeachers(req, res) {
  try {
    const data = await fetchAllTeachers(req.query);
    res.json(data);
  } catch (err) {
    console.error("getAllTeachers error:", err);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
}

export async function getFilterMeta(req, res) {
  try {
    const data = await fetchFilterMeta();
    res.json(data);
  } catch (err) {
    console.error("getFilterMeta error:", err);
    res.status(500).json({ error: "Failed to fetch filter metadata" });
  }
}

export async function getTeacher(req, res) {
  try {
    const data = await fetchTeacherById(req.params.id);
    res.json(data);
  } catch (err) {
    console.error("getTeacher error:", err);
    res.status(500).json({ error: "Failed to fetch teacher" });
  }
}

export async function getMentors(req, res) {
  try {
    const courseIds = Array.isArray(req.body.courseIds) ? req.body.courseIds : [];
    const data = await fetchMentors(courseIds);
    res.json({ mentors: data || [] });
  } catch (err) {
    console.error("getMentors error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function isOwner(req, res) {
  try {
    const { uid, teacherid } = req.body;
    const data = await checkIsOwner(uid, teacherid);
    res.json(data);
  } catch (err) {
    console.error("isOwner error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function saveAvailability(req, res) {
  try {
    const { teacherid, slots } = req.body;
    const data = await saveTeacherAvailability(teacherid, slots);
    res.json(data);
  } catch (err) {
    console.error("saveAvailability error:", err);
    res.status(500).json({ success: false, message: "Failed to save availability" });
  }
}

export async function recommendMentors(req, res) {
  try {
    const { domain } = req.body;
    const result = await getMentorsByDomain(domain);
    res.status(200).json(result); // ✅ always { mentors: [...] }
  } catch (err) {
    console.error("Mentor recommendation failed:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}
