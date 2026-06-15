import express from "express";
import { updateGithub, updateResume, updateProjectDetails, updateSelectedRoadmap } from "../controllers/studentController.js";

const router = express.Router();

router.post("/github", updateGithub);
router.post("/resume", updateResume);
router.post("/roadmap", updateSelectedRoadmap);
router.post("/project-details", updateProjectDetails);
export default router;
