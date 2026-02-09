import express from "express";
import { activeCourse, sessions } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/active-course/:uid", activeCourse);
router.get("/sessions/:uid", sessions);

export default router;
