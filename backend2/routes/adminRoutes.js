import express from "express";
import { validate } from "../middleware/validate.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  adminTeacherCreateSchema,
  adminTeacherUpdateSchema,
} from "../schemas/adminTeacherSchema.js";
import {
  adminListTeachers,
  adminGetTeacher,
  adminCreateTeacher,
  adminUpdateTeacher,
  adminDeleteTeacher,
} from "../controllers/adminTeacherController.js";
import {
  adminListPaymentBookings,
  adminApproveBookingPayment,
  adminRejectBookingPayment,
} from "../controllers/adminPaymentController.js";

const router = express.Router();

router.use(requireAdmin);

router.get("/bookings/payments", adminListPaymentBookings);
router.patch("/bookings/:bookingId/approve-payment", adminApproveBookingPayment);
router.patch("/bookings/:bookingId/reject-payment", adminRejectBookingPayment);

router.get("/teachers", adminListTeachers);
router.get("/teachers/:tId", adminGetTeacher);
router.post("/teachers", validate(adminTeacherCreateSchema), adminCreateTeacher);
router.patch("/teachers/:tId", validate(adminTeacherUpdateSchema), adminUpdateTeacher);
router.delete("/teachers/:tId", adminDeleteTeacher);

export default router;
