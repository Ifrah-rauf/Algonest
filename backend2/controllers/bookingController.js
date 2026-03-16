import { bookPlanCore, createSessionRecord, createBookingService, bookingMailService,getPlanService,getTimeSlotsService } from "../services/bookingService.js";
import { createZoomMeeting } from "../services/zoomService.js";


export async function createBooking(req, res) {
  try {
    const result = await createBookingService(req.body);
    res.json({ success: true, message: "Booking created & email sent!", result });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ success: false, message: "Email failed", error });
  } 
}

export async function bookingMail(req, res) {
  try {
    const result = await bookingMailService(req.body);
    res.json({ success: true, message: "Email sent successfully!", result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Email failed", error: error.message });
  }
}

export async function getPlan(req, res) {
  try {
    const result = await getPlanService(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

export async function getTimeSlots(req, res) {
  try {
    const result = await getTimeSlotsService(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

export async function bookPlan(req, res) {
  console.log("BOOK PLAN CONTROLLER HIT IN BACKEND");

  try {
    console.log("Incoming request body:", req.body);

    const { studentId, slot } = req.body;

    if (!studentId || !slot) {
      console.error("Missing required params:", { studentId, slot });
      return res.status(400).json({
        success: false,
        message: "Missing studentId or slot"
      });
    }

    console.log("Step 1: Running bookPlanCore");
    const coreResult = await bookPlanCore({ studentId, slot });
    console.log("bookPlanCore result:", coreResult);

    if (!coreResult?.success) {
      console.warn("bookPlanCore failed:", coreResult);
      return res.status(200).json(coreResult);
    }

    console.log("Step 2: Creating Zoom meeting");

    const topic = "AlgoNest Session";

    const meeting = await createZoomMeeting({
      topic,
      startTime: slot.startat,
      duration: 30
    });

    console.log("Zoom meeting created:", meeting);

    if (!meeting || !meeting.id) {
      console.error("Zoom meeting creation returned invalid object:", meeting);
      throw new Error("Zoom meeting creation failed");
    }

    console.log("Step 3: Creating session record");

    const finalResult = await createSessionRecord({
      studentId,
      slot,
      meeting,
      sb_id: coreResult.sb_id
    });

    console.log("Session record result:", finalResult);

    if (!finalResult) {
      throw new Error("Session record creation failed");
    }

    console.log("BOOK PLAN SUCCESS. Returning response.");

    return res.status(200).json(finalResult);

  } catch (err) {

    console.error("BOOK PLAN CONTROLLER ERROR");
    console.error("Error message:", err.message);
    console.error("Stack trace:", err.stack);
    console.error("Full error object:", err);

    return res.status(500).json({
      success: false,
      message: "Server crash",
      error: err.message
    });
  }
}