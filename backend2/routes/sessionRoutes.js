import express from "express";

import { prepareSessionData,checkSession,getSessionHistory,checkTSession } from "../controllers/sessionController";
const router = express.Router();

router.post("/prepare", prepareSessionData);
router.post("/check", checkSession);
router.post("/checkTsession", checkTSession);
router.post("/getSessionHistory", getSessionHistory);

export default router;
