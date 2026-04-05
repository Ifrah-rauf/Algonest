import * as lessonService from "../services/lessonService.js";

export async function getLessons(req, res) {
  try {
    const lessons = await lessonService.listLessons();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getTopics(req, res) {
  const { lessonId } = req.params;
  try {
    const topics = await lessonService.getLessonTopics(lessonId);
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function completeLesson(req, res) {
  const { studentId, lessonId } = req.body;
  try {
    const progress = await lessonService.markLessonComplete(studentId, lessonId);
    res.json({ message: "Lesson completed", progress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function completeTopic(req, res) {
  const { studentId, topicId } = req.body;
  if (!studentId || !topicId) {
    return res.status(400).json({ success: false, message: "studentId and topicId required" });
  }

  try {
    const progress = await lessonService.markTopicComplete(studentId, topicId);
    res.json({ success: true, progress });
  } catch (err) {
    console.error("❌ completeTopic error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}
