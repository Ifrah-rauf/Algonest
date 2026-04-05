import * as supportService from "../services/supportService.js";

export async function getSupportSessions(req, res) {
  const { studentId } = req.params;
  try {
    const { data, error } = await supportService.listSupportSessions(studentId);
    if (error) return res.status(400).json({ error });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createSupport(req, res) {
  const { studentId, teacherId, lessonId, time } = req.body;
  try {
    const { data, error } = await supportService.scheduleSupport(studentId, teacherId, lessonId, time);
    if (error) return res.status(400).json({ error });
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
