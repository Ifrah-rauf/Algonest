import express from "express";
import { activeCourse, sessions,getDashboard, getTourStatus, completeTour } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/active-course/:uid", activeCourse);
router.get("/sessions/:uid", sessions);
router.get("/getDashboard/:uid", getDashboard);
router.get("/tour/:uid", getTourStatus);
router.patch("/tour/:uid", completeTour);

export default router;
