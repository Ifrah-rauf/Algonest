import express from "express";
import { getSupportSessions, createSupport, sendTeacherQuery, sendAccountDeletionRequest } from "../controllers/supportController.js";

const router = express.Router();
router.post("/teacher-query", sendTeacherQuery);
router.post("/account-deletion-request", sendAccountDeletionRequest);
router.get("/:studentId", getSupportSessions);
router.post("/", createSupport);
export default router;
