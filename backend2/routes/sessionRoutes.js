import express from "express";
import { prepareSessionData,checkSession,getSessionHistory } from "../controllers/sessionController.js";

const router = express.Router();

router.post("/prepare", prepareSessionData);
router.post("/check", checkSession);
router.post("/getSessionHistory", getSessionHistory);

export default router;
