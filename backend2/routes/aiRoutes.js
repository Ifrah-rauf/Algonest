import express from "express";
import { handleAIMessage, getAccessStatus, getHistory } from "../controllers/aiController.js";

const router = express.Router();

// POST /api/ai
router.post("/handleAi",handleAIMessage);
router.post("/access", getAccessStatus);
router.post("/history",  getHistory); 
export default router;
