import {
  bookPlanCore,
  createSessionRecord,
  createBookingService,
  bookingMailService,
  getPlanService,
  getTimeSlotsService,
  getStudentCheckpointBookingGuard,
  getStudentInterviewBookingGuard,
  CODE,
} from "../services/bookingService.js";
import { createCourseBookingService } from "../services/courseBookingService.js";
import { createZoomMeeting } from "../services/zoomService.js";
import { attachSessionToCheckpoint, attachSessionToInterview } from "../services/lessonService.js";

/* ============================================================
   HELPER — unified error response
============================================================ */
function serverError(res, label, err) {
  console.error(`[${label}]`, err.message);
  console.error(err.stack);
  return res.status(500).json({
    success: false,
    code: "SERVER_ERROR",
    message: "An unexpected error occurred. Please try again.",
    ...(process.env.NODE_ENV !== "production" && { debug: err.message }),
  });
}

/* ============================================================
   1) CREATE BOOKING
   POST /api/booking/createBooking
============================================================ */
export async function createBooking(req, res) {
  try {
    const result = await createBookingService(req.body);
    return res.json({ success: true, message: "Booking created & email sent!", result });
  } catch (err) {
    return serverError(res, "createBooking", err);
  }
}

/* ============================================================
   1B) CREATE COURSE BOOKING
   POST /api/booking/course-booking
============================================================ */
export async function createCourseBooking(req, res) {
  try {
    const {
      uid,
      courseId = 1,
      paymentId = null,
      planId = null,
      remainingSessions = 12,
      expiryDays = 120,
      projectId = null,
    } = req.body || {};

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "Missing uid",
      });
    }

    const result = await createCourseBookingService({
      uid,
      courseId,
      paymentId,
      planId,
      remainingSessions,
      expiryDays,
      projectId,
    });

    return res.json({
      success: true,
      message: "Booking inserted successfully",
      result,
    });
  } catch (err) {
    return serverError(res, "createCourseBooking", err);
  }
}

/* ============================================================
   2) BOOKING MAIL
   POST /api/booking/bookingMail
============================================================ */
export async function bookingMail(req, res) {
  try {
    const { studentId, slot } = req.body;

    if (!studentId || !slot) {
      return res.status(400).json({
        success: false,
        message: "Missing studentId or slot",
      });
    }

    const result = await bookingMailService({ studentId, slot });
    return res.json({ success: true, message: "Email sent successfully!", result });
  } catch (err) {
    return serverError(res, "bookingMail", err);
  }
}

/* ============================================================
   3) GET PLAN
   POST /api/booking/getPlan
============================================================ */
export async function getPlan(req, res) {
  try {
    const { userId, teacherId, slot } = req.body;

    if (!userId || !teacherId || !slot) {
      return res.status(400).json({
        success: false,
        code: CODE.PLAN_EXPIRED,
        message: "Missing required fields: userId, teacherId, slot",
      });
    }

    const result = await getPlanService({ userId, teacherId, slot });
    return res.json(result);
  } catch (err) {
    return serverError(res, "getPlan", err);
  }
}

export async function getCheckpointBookingGuard(req, res) {
  try {
    const { userId, checkpointId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        code: "BAD_REQUEST",
        message: "Missing userId",
      });
    }

    const data = await getStudentCheckpointBookingGuard({
      userId,
      checkpointId: checkpointId || null,
    });

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    return serverError(res, "getCheckpointBookingGuard", err);
  }
}

export async function getInterviewBookingGuard(req, res) {
  try {
    const { userId, interviewId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        code: "BAD_REQUEST",
        message: "Missing userId",
      });
    }

    const data = await getStudentInterviewBookingGuard({
      userId,
      interviewId: interviewId || null,
    });

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    return serverError(res, "getInterviewBookingGuard", err);
  }
}

/* ============================================================
   4) GET TIME SLOTS
   POST /api/booking/getTimeSlots
============================================================ */
export async function getTimeSlots(req, res) {
  try {
    const { teachers_id } = req.body;

    if (!teachers_id) {
      return res.status(400).json({
        success: false,
        message: "Missing teachers_id",
      });
    }

    const result = await getTimeSlotsService({ teachers_id });
    return res.json(result);
  } catch (err) {
    return serverError(res, "getTimeSlots", err);
  }
}

/* ============================================================
   5) BOOK PLAN
   POST /api/booking/bookPlan

   Flow:
     Step 1 — bookPlanCore   : validate + write (slot, session deduct, slotbooking)
     Step 2 — createZoomMeeting : only called after all DB writes succeed
     Step 3 — createSessionRecord : persist session row with Zoom details
============================================================ */
export async function bookPlan(req, res) {
  const { studentId, slot, checkpointId, interviewId } = req.body;

  if (!studentId || !slot) {
    return res.status(400).json({
      success: false,
      code: "BAD_REQUEST",
      message: "Missing studentId or slot",
    });
  }

  // ── STEP 1: validate + write booking data ──────────────
  let coreResult;
  try {
    coreResult = await bookPlanCore({
      studentId,
      slot,
      checkpointId: checkpointId || null,
      interviewId: interviewId || null,
    });
  } catch (err) {
    return serverError(res, "bookPlan/bookPlanCore", err);
  }

  // Surface non-success codes directly to frontend (not 500s)
  if (!coreResult?.success) {
    return res.status(200).json(coreResult);
  }

  // ── STEP 2: create Zoom meeting ────────────────────────
  let meeting;
  try {
    meeting = await createZoomMeeting({
      topic: "AlgoNest Session",
      startTime: slot.startat,
      duration: slot.durationmin ?? 30,
    });
  } catch (err) {
    // Zoom failed — compensate: unmark slot + restore session count
    console.error("[bookPlan/zoom] Zoom meeting creation failed:", err.message);
    await compensate({ slot, bookingId: coreResult.booking_id, studentId });
    return res.status(500).json({
      success: false,
      code: "ZOOM_FAILED",
      message: "Could not create the Zoom meeting. Your booking has been rolled back. Please try again.",
    });
  }

  if (!meeting?.id) {
    await compensate({ slot, bookingId: coreResult.booking_id, studentId });
    return res.status(500).json({
      success: false,
      code: "ZOOM_FAILED",
      message: "Zoom returned an invalid response. Please try again.",
    });
  }

  // ── STEP 3: create session record ──────────────────────
  let finalResult;
  try {
    finalResult = await createSessionRecord({
      bookingId: coreResult.booking_id,
      slot,
      meeting,
      sessionType: interviewId ? "interview" : checkpointId ? "checkpoint" : "session",
      sb_id: coreResult.sb_id,
    });
  } catch (err) {
    // Session insert failed — compensate
    console.error("[bookPlan/session] Session record creation failed:", err.message);
    await compensate({ slot, bookingId: coreResult.booking_id, studentId });
    return res.status(500).json({
      success: false,
      code: "SESSION_INSERT_FAILED",
      message: "Session could not be saved. Your booking has been rolled back. Please try again.",
    });
  }

  if (checkpointId && finalResult?.session?.session_id) {
    try {
      const checkpoint = await attachSessionToCheckpoint({
        checkpointId,
        studentId,
        sessionId: finalResult.session.session_id,
      });
      finalResult.checkpoint = checkpoint;
    } catch (err) {
      console.error("[bookPlan/checkpoint] Failed to attach session to checkpoint:", err.message);
      return res.status(500).json({
        success: false,
        code: "CHECKPOINT_LINK_FAILED",
        message: "Session was created, but checkpoint linking failed. Please contact support.",
        session_id: finalResult.session.session_id,
      });
    }
  }

  if (interviewId && finalResult?.session?.session_id) {
    try {
      const interview = await attachSessionToInterview({
        interviewId,
        studentId,
        sessionId: finalResult.session.session_id,
        notes: finalResult.session?.title || "Interview session",
      });
      finalResult.interview = interview;
    } catch (err) {
      console.error("[bookPlan/interview] Failed to attach session to interview:", err.message);
      return res.status(500).json({
        success: false,
        code: "INTERVIEW_LINK_FAILED",
        message: "Session was created, but interview linking failed. Please contact support.",
        session_id: finalResult.session.session_id,
      });
    }
  }

  finalResult.session_id = finalResult.session?.session_id || null;

  return res.status(200).json(finalResult);
}

/* ============================================================
   COMPENSATE — rolls back slot + session deduction on failure
   Called when Zoom or session insert fails after bookPlanCore
   already wrote to the DB.
============================================================ */
async function compensate({ slot, bookingId, studentId }) {
  try {
    const { supabase } = await import("../lib/supabase.js");

    // 1. Unmark the slot
    await supabase
      .from("timeslot")
      .update({ isbooked: false })
      .eq("slot_id", slot.slot_id);

    // 2. Restore the session count
    const { data: booking } = await supabase
      .from("booking")
      .select("remainingsessions")
      .eq("booking_id", bookingId)
      .maybeSingle();

    if (booking) {
      await supabase
        .from("booking")
        .update({ remainingsessions: booking.remainingsessions + 1 })
        .eq("booking_id", bookingId);
    }

    // 3. Remove the slotbooking row
    await supabase
      .from("slotbooking")
      .delete()
      .eq("bookingid", bookingId)
      .eq("slotid", slot.slot_id);

    console.log(`[compensate] Rollback complete for slot ${slot.slot_id}, booking ${bookingId}`);
  } catch (compensateErr) {
    // Log loudly — this is a data integrity issue requiring manual review
    console.error("[compensate] ROLLBACK FAILED — manual intervention needed:", compensateErr.message);
    console.error("Affected slot_id:", slot.slot_id);
    console.error("Affected booking_id:", bookingId);
    console.error("Affected student_id:", studentId);
  }
}
