// routes/teachersRoutes.js
import express from "express";
import {
  getAllTeachers,
  getFilterMeta,
  getTeacher,
  getMentors,
  isOwner,
  saveAvailability,
  recommendMentors
} from "../controllers/teacherController.js";
import { getTeacherStudents } from "../controllers/teacherDashboardController.js";
const router = express.Router();
router.post("/getMentorsByDomain", recommendMentors);
router.get("/getAllTeachers", getAllTeachers);
router.get("/getFilterMeta", getFilterMeta);
router.get("/getTeacher/:id", getTeacher);
router.post("/getMentors", getMentors);
router.post("/isOwner", isOwner);
router.post("/save", saveAvailability);
// returns students connected to the teacher (expects teacher uid in body/query/params)
router.post("/students", getTeacherStudents);

export default router;
