import express from "express";
import { getTeacherStudents } from "../controllers/teacherDashboardController.js";

const router = express.Router();

// POST /students -> expects { uid } in body/query/params
router.post("/students", getTeacherStudents);

export default router;
