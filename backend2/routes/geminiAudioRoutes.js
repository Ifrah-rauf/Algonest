import express from "express";

import multer from "multer";

import {
 analyzeMeetingController
}
from "../controllers/geminiAudioController.js";
import {
  getPendingSessionProcessingController,
  markSessionCompleteController,
  runSessionProcessingController,
  uploadSessionRecordingController,
  zoomSessionLifecycleHandler,
} from "../controllers/sessionProcessingController.js";



const router = express.Router();



const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});



router.post(
    "/analyze-meeting",

    upload.single("audio"),

    analyzeMeetingController

);

router.post("/webhook/session-lifecycle", zoomSessionLifecycleHandler);

router.get("/processing/pending/:tId", getPendingSessionProcessingController);

router.post(
  "/sessions/:sessionId/recording",
  upload.single("audio"),
  uploadSessionRecordingController
);

router.post("/sessions/:sessionId/complete", markSessionCompleteController);

router.post("/processing/:jobId/run", runSessionProcessingController);



export default router;
