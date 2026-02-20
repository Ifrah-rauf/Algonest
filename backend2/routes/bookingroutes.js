import express from "express";
import {
  createBooking,
  bookingMail,
  getPlan,
  getTimeSlots,
  bookPlanCore
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create", createBooking);
router.post("/bookingMail", bookingMail);
router.post("/getPlan", getPlan);
router.post("/getTimeSlots", getTimeSlots);
router.post("/bookPlan", bookPlanCore);

export default router;
