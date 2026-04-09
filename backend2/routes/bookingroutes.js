import express from "express";
import {
  createBooking,
  bookingMail,
  getPlan,
  getCheckpointBookingGuard,
  getTimeSlots,
  bookPlan
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create", createBooking);
router.post("/bookingMail", bookingMail);
router.post("/getPlan", getPlan);
router.post("/checkpointBookingGuard", getCheckpointBookingGuard);
router.post("/getTimeSlots", getTimeSlots);
router.post("/bookPlan", bookPlan);

export default router;
