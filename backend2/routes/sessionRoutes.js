import express from "express";

import { prepareSessionData,checkSession,getSessionHistory,checkTSession, completeSession} from "../controllers/sessionController.js";
const router = express.Router();

router.post("/prepare", prepareSessionData);
router.post("/check", checkSession);
router.post("/checkTsession", checkTSession);
router.post("/getSessionHistory", getSessionHistory);
router.post("/:id/complete", completeSession);
export default router;
