import {
  fetchLessons,
  fetchLessonTopics,
  fetchLessonTopicMaterials,
  fetchCheckpoints,
  getLessonById,
  fetchLessonProgressByUid
} from "../services/lessonService.js";

export async function getAllLessons(req, res) {
  try {
    const data = await fetchLessons();

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.error("getAllLessons error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch lessons"
    });
  }
}

export async function getAllLessonTopics(req, res) {
  try {
    const data = await fetchLessonTopics();

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.error("getAllLessonTopics error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch lesson topics"
    });
  }
}

export async function getAllLessonTopicMaterials(req, res) {
  try {
    const data = await fetchLessonTopicMaterials();

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.error("getAllLessonTopicMaterials error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch lesson topic materials"
    });
  }
}

export async function getAllCheckpoints(req, res) {
  try {
    const data = await fetchCheckpoints();

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.error("getAllCheckpoints error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch checkpoints"
    });
  }
}
export async function getLesson(req, res) {
  try {
    const { lessonId } = req.params;

    if (!lessonId) {
      return res.status(400).json({ error: "lessonId is required." });
    }

    const lesson = await getLessonById(Number(lessonId));

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found." });
    }

    return res.status(200).json({ success: true, lesson });

  } catch (error) {
    console.error("getLesson error:", error);
    return res.status(500).json({ error: "Failed to fetch lesson." });
  }
}

export async function getLessonProgress(req, res) {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "uid is required",
      });
    }

    const data = await fetchLessonProgressByUid(uid);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("getLessonProgress error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch lesson progress",
    });
  }
}
