import express from "express";
import { getCheckpoints, completeCheckpoint } from "../controllers/checkpointController.js";

const router = express.Router();
router.get("/:studentId", getCheckpoints);
router.post("/:checkpointId/complete", completeCheckpoint);
export default router;
