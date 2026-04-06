import express from "express";
import { submitLessonQuizResult } from "../controllers/quizController.js";

const router = express.Router();

router.post("/lesson-result", submitLessonQuizResult);

export default router;
