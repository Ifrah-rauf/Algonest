import { saveLessonQuizResult } from "../services/quizService.js";

export async function submitLessonQuizResult(req, res) {
  try {
    const {
      uid,
      lessonId,
      score,
      totalQuestions,
      attempts,
      passed,
    } = req.body || {};

    if (!uid || !lessonId) {
      return res.status(400).json({
        success: false,
        message: "uid and lessonId are required.",
      });
    }

    const data = await saveLessonQuizResult({
      uid,
      lessonId,
      score,
      totalQuestions,
      attempts,
      passed,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("submitLessonQuizResult error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save quiz result.",
    });
  }
}
