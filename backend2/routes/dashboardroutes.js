import express from "express";
import { activeCourse, sessions,getDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/active-course/:uid", activeCourse);
router.get("/sessions/:uid", sessions);
router.get("/getDashboard/:uid", getDashboard);

export default router;
