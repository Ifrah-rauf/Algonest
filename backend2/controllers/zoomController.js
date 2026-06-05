// controllers/zoomController.js
import { getZoomAccessToken, createSessionWithZoom } from "../services/zoomService.js";
import crypto from "crypto";
import { ensurePendingProcessingJobFromZoomEvent } from "../services/sessionProcessingService.js";

export async function getToken(req, res) {
  try {
    const token = await getZoomAccessToken();
    res.status(200).json({ token });
  } catch (error) {
    console.error("Zoom Token Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get Zoom token" });
  }
}

export async function createMeeting(req, res) {
  try {
    const session = await createSessionWithZoom(req.body);

    return res.status(200).json({
      success: true,
      join_url: session.join_url,
      session_id: session.session_id
    });

  } catch (error) {
    console.error("Create Meeting Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create session"
    });
  }
}


export async function zoomWebhookHandler(req, res) {
  try {
    const event = req.body.event;

    // 🔹 Zoom URL validation handshake
    if (event === "endpoint.url_validation") {
      const plainToken = req.body.payload.plainToken;

      const encryptedToken = crypto
        .createHmac("sha256", process.env.ZOOM_WEBHOOK_SECRET)
        .update(plainToken)
        .digest("hex");

      return res.status(200).json({
        plainToken,
        encryptedToken,
      });
    }

    // 🔹 Real events after validation
    console.log("Zoom Event:", event);
    console.log("Payload:", req.body.payload);

    if (event === "meeting.ended" || event === "recording.completed") {
      try {
        await ensurePendingProcessingJobFromZoomEvent(req.body);
      } catch (processingError) {
        console.error("[zoomWebhook] failed to create pending processing job:", processingError.message);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook failed" });
  }
}
