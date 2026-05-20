import {
  fetchLessons,
  fetchLessonTopics,
  fetchLessonTopicMaterials,
  fetchCheckpoints,
  fetchInterviews,
  getLessonById,
  fetchLessonProgressByUid,
  fetchCheckpointProgressByUid,
  fetchInterviewProgressByUid,
  getCheckpointBookingStatus
} from "../services/lessonService.js";

export async function getAllLessons(req, res) {
  try {
    const { courseId } = req.query;
    const data = await fetchLessons(courseId ? Number(courseId) : null);

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
    const { courseId } = req.query;
    const data = await fetchLessonTopics(courseId ? Number(courseId) : null);

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
    const { courseId } = req.query;
    const data = await fetchLessonTopicMaterials(courseId ? Number(courseId) : null);

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
    const { courseId } = req.query;
    const data = await fetchCheckpoints(courseId ? Number(courseId) : null);

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

export async function getAllInterviews(req, res) {
  try {
    const { courseId } = req.query;
    const data = await fetchInterviews(courseId ? Number(courseId) : null);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("getAllInterviews error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
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
    const { courseId } = req.query;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "uid is required",
      });
    }

    const data = await fetchLessonProgressByUid(uid, courseId ? Number(courseId) : null);

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

export async function getCheckpointStatus(req, res) {
  try {
    const { checkpointId } = req.params;
    const { uid, courseId } = req.query;

    if (!checkpointId) {
      return res.status(400).json({
        success: false,
        message: "checkpointId is required",
      });
    }

    const data = await getCheckpointBookingStatus(
      Number(checkpointId),
      uid || null,
      courseId ? Number(courseId) : null
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("getCheckpointStatus error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch checkpoint booking status",
    });
  }
}

export async function getCheckpointProgress(req, res) {
  try {
    const { uid } = req.params;
    const { courseId } = req.query;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "uid is required",
      });
    }

    const data = await fetchCheckpointProgressByUid(uid, courseId ? Number(courseId) : null);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("getCheckpointProgress error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch checkpoint progress",
    });
  }
}

export async function getInterviewProgress(req, res) {
  try {
    const { uid } = req.params;
    const { courseId } = req.query;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "uid is required",
      });
    }

    const data = await fetchInterviewProgressByUid(uid, courseId ? Number(courseId) : null);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("getInterviewProgress error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview progress",
    });
  }
}
