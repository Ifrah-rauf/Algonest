// routes/teachersRoutes.js

import express from "express";
import {
  getAllTeachers,
  getFilterMeta,
  getTeacher,
  getMentors,
  isOwner,
  saveAvailability
} from "../controllers/teacherController.js";

const router = express.Router();

router.get("/getAllTeachers", getAllTeachers);
router.get("/getFilterMeta", getFilterMeta);
router.get("/getTeacher/:id", getTeacher);
router.post("/getMentors", getMentors);
router.post("/isOwner", isOwner);
router.post("/save", saveAvailability);

export default router;
