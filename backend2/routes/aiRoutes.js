import express from "express";
import { handleAIMessage,getHistory } from "../controllers/aiController.js";

const router = express.Router();

// POST /api/ai
router.post("/handleAi",handleAIMessage);
router.post("/history",  getHistory); 
export default router;