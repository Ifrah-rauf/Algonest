import express from "express";
import { getSupportSessions, createSupport } from "../controllers/supportController.js";

const router = express.Router();
router.get("/:studentId", getSupportSessions);
router.post("/", createSupport);
export default router;