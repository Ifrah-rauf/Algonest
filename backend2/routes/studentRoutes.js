import express from "express";
import { updateGithub, updateResume } from "../controllers/studentController.js";

const router = express.Router();

router.post("/github", updateGithub);
router.post("/resume", updateResume);
export default router;
