import express from "express";
import {
  getTeacherStudents,
  getTeacherOverview,
  getTeacherEarnings,
  getTeacherCourses,
  getTeacherProfile,
  updateTeacherProfile,
  addTeacherCertificate,
  approveTeacherCertificate,
} from "../controllers/teacherDashboardController.js";

const router = express.Router();

// POST /students -> expects { uid } in body/query/params
router.post("/students", getTeacherStudents);
router.post("/overview", getTeacherOverview);
router.post("/earnings", getTeacherEarnings);
router.post("/courses", getTeacherCourses);
router.post("/profile", getTeacherProfile);
router.post("/profile/update", updateTeacherProfile);
router.post("/profile/certificates", addTeacherCertificate);
router.post("/profile/certificates/approve", approveTeacherCertificate);

export default router;
