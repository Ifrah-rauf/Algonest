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
  getCheckpointBookingStatus,
  saveLessonAIQuestion,
  saveLessonAssetProgress,
  saveLessonCommitProof,
  fetchLessonAssetProgressByUid,
  fetchLessonCommitProofsByUid,
  fetchLessonAIQuestionsByUid,
  upsertLessonProgress
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

export async function trackLessonAIQuestion(req, res) {
  try {
    const {
      userId,
      lessonId,
      courseId,
      questionKey,
      questionText,
      completed,
    } = req.body || {};
    console.log("[trackLessonAIQuestion]", { userId, lessonId, courseId, questionKey, completed });

    const data = await saveLessonAIQuestion({
      userId,
      lessonId,
      courseId,
      questionKey,
      questionText,
      completed,
    });

    return res.status(200).json({
      success: true,
      data,
      message: "AI question tracked.",
    });
  } catch (err) {
    console.error("trackLessonAIQuestion error:", err);
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to track AI question.",
    });
  }
}

export async function getLessonAIQuestions(req, res) {
  try {
    const { uid } = req.params;
    const { courseId, lessonId } = req.query;

    const data = await fetchLessonAIQuestionsByUid(
      uid,
      courseId ? Number(courseId) : null,
      lessonId ? Number(lessonId) : null
    );

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("getLessonAIQuestions error:", err);
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch AI questions.",
    });
  }
}

export async function saveLessonAssetAnswer(req, res) {
  try {
    const {
      userId,
      lessonId,
      courseId,
      assetKey,
      answerText,
      answered,
    } = req.body || {};
    console.log("[saveLessonAssetAnswer]", { userId, lessonId, courseId, assetKey, answered });

    const data = await saveLessonAssetProgress({
      userId,
      lessonId,
      courseId,
      assetKey,
      answerText,
      answered,
    });

    return res.status(200).json({
      success: true,
      data,
      readyToUnlock: data.unlock?.readyToUnlock === true,
      message: "Asset answer saved.",
    });
  } catch (err) {
    console.error("saveLessonAssetAnswer error:", err);
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to save asset answer.",
    });
  }
}

export async function getLessonAssetAnswers(req, res) {
  try {
    const { uid } = req.params;
    const { courseId, lessonId } = req.query;

    const data = await fetchLessonAssetProgressByUid(
      uid,
      courseId ? Number(courseId) : null,
      lessonId ? Number(lessonId) : null
    );

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("getLessonAssetAnswers error:", err);
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch asset answers.",
    });
  }
}

export async function submitLessonCommitProof(req, res) {
  try {
    const {
      userId,
      lessonId,
      courseId,
      repoUrl,
      commitSha,
      deliverable,
      microProof,
    } = req.body || {};
    console.log("[submitLessonCommitProof]", { userId, lessonId, courseId, repoUrl, commitSha });

    const data = await saveLessonCommitProof({
      userId,
      lessonId,
      courseId,
      repoUrl,
      commitSha,
      deliverable,
      microProof,
    });
    const proof = data.row || data;
    const verified = proof.verified === true;

    return res.status(200).json({
      success: true,
      data,
      verified,
      readyToUnlock: data.unlock?.readyToUnlock === true,
      message: verified
        ? "Commit proof saved."
        : "Commit proof saved, but the repo URL or commit SHA format could not be verified.",
    });
  } catch (err) {
    console.error("submitLessonCommitProof error:", err);
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to save commit proof.",
    });
  }
}

export async function getLessonCommitProofs(req, res) {
  try {
    const { uid } = req.params;
    const { courseId, lessonId } = req.query;

    const data = await fetchLessonCommitProofsByUid(
      uid,
      courseId ? Number(courseId) : null,
      lessonId ? Number(lessonId) : null
    );

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("getLessonCommitProofs error:", err);
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch commit proofs.",
    });
  }
}

export async function saveLessonProgress(req, res) {
  try {
    const {
      userId,
      lessonId,
      completed,
      completedAt,
      quizMarks,
      quizPassed,
      quizAttempt,
      readyToUnlock,
    } = req.body || {};

    const data = await upsertLessonProgress({
      userId,
      lessonId,
      completed,
      completedAt,
      quizMarks,
      quizPassed,
      quizAttempt,
      readyToUnlock,
    });

    return res.status(200).json({
      success: true,
      data,
      message: "Lesson progress saved.",
    });
  } catch (err) {
    console.error("saveLessonProgress error:", err);
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to save lesson progress.",
    });
  }
}
