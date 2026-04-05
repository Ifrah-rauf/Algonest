import express from "express";
//checkTSession,
import { prepareSessionData,checkSession,getSessionHistory,createSession,updateAttendance } from "../controllers/sessionController.js";
const router = express.Router();

router.post("/prepare", prepareSessionData);
router.post("/check", checkSession);
//router.post("/checkTsession", checkTSession);
router.post("/getSessionHistory", getSessionHistory);
router.post("/", createSession); // POST /sessions
router.patch("/:sessionId/attendance", updateAttendance); // PATCH /sessions/:sessionId/attendance


export default router;
