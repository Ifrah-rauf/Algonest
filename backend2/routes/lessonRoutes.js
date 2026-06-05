import express from "express";
import {
  getAllLessons,
  getAllLessonTopics,
  getAllLessonTopicMaterials,
  getAllCheckpoints,
  getAllInterviews,
  getLesson,
  getLessonProgress,
  getCheckpointProgress,
  getInterviewProgress,
  getCheckpointStatus,
  trackLessonAIQuestion,
  getLessonAIQuestions,
  saveLessonAssetAnswer,
  getLessonAssetAnswers,
  submitLessonCommitProof,
  getLessonCommitProofs,
  saveLessonProgress
} from "../controllers/lessonController.js";

const router = express.Router();

router.get("/lessons", getAllLessons);
router.get("/lesson-topics", getAllLessonTopics);
router.get("/lesson-topic-materials", getAllLessonTopicMaterials);
router.get("/checkpoints", getAllCheckpoints);
router.get("/interviews", getAllInterviews);
router.get("/checkpoint-progress/:uid", getCheckpointProgress);
router.get("/interview-progress/:uid", getInterviewProgress);
router.get("/checkpoints/:checkpointId/status", getCheckpointStatus);
router.get("/progress/:uid", getLessonProgress);
router.post("/progress", saveLessonProgress);
router.get("/ai-questions/:uid", getLessonAIQuestions);
router.post("/ai-questions", trackLessonAIQuestion);
router.post("/ai-question", trackLessonAIQuestion);
router.get("/assets/:uid", getLessonAssetAnswers);
router.post("/assets", saveLessonAssetAnswer);
router.get("/commit-proofs/:uid", getLessonCommitProofs);
router.post("/commit-proofs", submitLessonCommitProof);
router.post("/github-commit", submitLessonCommitProof);
router.get("/:lessonId", getLesson);

export default router;
