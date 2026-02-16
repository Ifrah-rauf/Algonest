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
  try {

    const { studentId, slot } = req.body;

    // 1️⃣ Core booking validation & deduction
    const coreResult = await bookPlanCore({ studentId, slot });

    if (!coreResult.success)
      return res.status(200).json(coreResult);

    // 2️⃣ Create Zoom meeting
    const topic="AlgoNest Session"
    const meeting = await createZoomMeeting({
      topic,
      startTime: slot.startat,
      duration: 30
    });
    console.log("MEETING RESPONSE: ",meeting);

    // 3️⃣ Create session record
    const finalResult = await createSessionRecord({
      studentId,
      slot,
      meeting,
      sb_id:coreResult.sb_id
    });
    console.log("finalResult ",finalResult);
    console.log(finalResult.meeting_link," ",finalResult.zoom_meeting_id);
    return res.status(200).json(finalResult);

  } catch (err) {
    console.error("Booking Controller Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server crash"
    });
  }
}
