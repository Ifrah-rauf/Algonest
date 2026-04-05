
import express from "express";
import { getCourses, createCourse, getCourseLessons } from "../controllers/courseController.js";

const router = express.Router();
router.get("/", getCourses);
router.post("/", createCourse);
router.get("/:courseId/lessons", getCourseLessons);
export default router;
