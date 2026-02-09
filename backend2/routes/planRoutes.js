import express from "express";
import { courseOutline, getOutline, getPlans } from "../controllers/planController.js";

const router = express.Router();

router.get("/course-outline/:id", courseOutline);
router.get("/getOutline/:uid", getOutline);
router.get("/getPlans", getPlans);

export default router;
