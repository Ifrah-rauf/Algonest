import express from "express";
import { getLessons, getTopics, completeLesson,completeTopic } from "../controllers/lessonController.js";

const router = express.Router();
router.get("/", getLessons);
router.get("/:lessonId/topics", getTopics);
router.post("/complete", completeLesson);
router.post("/topics/complete", completeTopic);
export default router;
