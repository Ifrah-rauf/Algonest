// routes/projectRoutes.js
import express from "express";
import { recommendProjects } from "../controllers/projectController.js";

const router = express.Router();

router.post("/recommend", recommendProjects);

export default router;