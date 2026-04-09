import express from "express";
import {
  getAllLessons,
  getAllLessonTopics,
  getAllLessonTopicMaterials,
  getAllCheckpoints,
  getLesson,
  getLessonProgress,
  getCheckpointStatus
} from "../controllers/lessonController.js";

const router = express.Router();

router.get("/lessons", getAllLessons);
router.get("/lesson-topics", getAllLessonTopics);
router.get("/lesson-topic-materials", getAllLessonTopicMaterials);
router.get("/checkpoints", getAllCheckpoints);
router.get("/checkpoints/:checkpointId/status", getCheckpointStatus);
router.get("/progress/:uid", getLessonProgress);
router.get("/:lessonId", getLesson);

export default router;
