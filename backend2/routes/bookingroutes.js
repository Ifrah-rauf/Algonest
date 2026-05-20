import express from "express";
import {
  createBooking,
  createCourseBooking,
  bookingMail,
  getPlan,
  getCheckpointBookingGuard,
  getInterviewBookingGuard,
  getTimeSlots,
  bookPlan
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create", createBooking);
router.post("/course-booking", createCourseBooking);
router.post("/bookingMail", bookingMail);
router.post("/getPlan", getPlan);
router.post("/checkpointBookingGuard", getCheckpointBookingGuard);
router.post("/interviewBookingGuard", getInterviewBookingGuard);
router.post("/getTimeSlots", getTimeSlots);
router.post("/bookPlan", bookPlan);

export default router;
