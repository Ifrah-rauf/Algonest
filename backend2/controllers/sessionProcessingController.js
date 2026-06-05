import {
  markSessionCompleteAndQueueProcessing,
  ensurePendingProcessingJobFromZoomEvent,
  getPendingProcessingJobsByTeacherId,
  processSessionRecordingJob,
  uploadAndProcessSessionRecording,
} from "../services/sessionProcessingService.js";

export async function zoomSessionLifecycleHandler(req, res) {
  try {
    const event = req.body?.event;

    if (event === "endpoint.url_validation") {
      return res.status(200).json({ received: true });
    }

    if (event === "meeting.ended" || event === "recording.completed") {
      const job = await ensurePendingProcessingJobFromZoomEvent(req.body);
      return res.status(200).json({
        success: true,
        received: true,
        job_created: Boolean(job),
      });
    }

    return res.status(200).json({ success: true, received: true });
  } catch (error) {
    console.error("[session-processing] zoom lifecycle error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

export async function uploadSessionRecordingController(req, res) {
  try {
    const sessionId = Number(req.params.sessionId);
    if (!Number.isInteger(sessionId)) {
      return res.status(400).json({
        success: false,
        message: "Valid sessionId is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file required",
      });
    }

    const result = await uploadAndProcessSessionRecording({
      sessionId,
      file: req.file,
    });

    return res.status(202).json({
      success: true,
      message: "Recording uploaded and queued for processing",
      job: result.job,
      recording_url: result.recordingUrl,
    });
  } catch (error) {
    console.error("[session-processing] upload error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

export async function getPendingSessionProcessingController(req, res) {
  try {
    const tId = Number(req.params.tId);
    if (!Number.isInteger(tId)) {
      return res.status(400).json({
        success: false,
        message: "Valid tId is required",
      });
    }

    const jobs = await getPendingProcessingJobsByTeacherId(tId);
    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("[session-processing] pending jobs error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

export async function runSessionProcessingController(req, res) {
  try {
    const jobId = req.params.jobId;
    const result = await processSessionRecordingJob(jobId);
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("[session-processing] run job error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

export async function markSessionCompleteController(req, res) {
  try {
    const sessionId = Number(req.params.sessionId || req.body?.sessionId);
    const feedback = req.body?.feedback ?? null;

    if (!Number.isInteger(sessionId)) {
      return res.status(400).json({
        success: false,
        message: "Valid sessionId is required",
      });
    }

    const result = await markSessionCompleteAndQueueProcessing({
      sessionId,
      feedback,
    });

    return res.status(200).json({
      success: true,
      message: "Session marked complete and queued for processing",
      result,
    });
  } catch (error) {
    console.error("[session-processing] mark complete error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
