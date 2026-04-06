import express from "express";
import { courseOutline, getOutline, getPlans,getCourse } from "../controllers/planController.js";

const router = express.Router();

router.get("/course-outline/:id", courseOutline);
router.get("/getOutline/:uid", getOutline);
router.get("/getPlans", getPlans);
router.get("/getCourse", getCourse);

export default router;
