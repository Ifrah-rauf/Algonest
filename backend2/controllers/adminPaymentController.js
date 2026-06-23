import {
  listPaymentBookings,
  updateBookingPaymentStatus,
} from "../services/adminPaymentService.js";

export async function adminListPaymentBookings(req, res) {
  try {
    const bookings = await listPaymentBookings(req.query.status || "pending");
    res.json({ success: true, bookings });
  } catch (err) {
    console.error("adminListPaymentBookings error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to load bookings" });
  }
}

export async function adminApproveBookingPayment(req, res) {
  try {
    const booking = await updateBookingPaymentStatus({
      bookingId: req.params.bookingId,
      status: "approved",
      approvedBy: req.adminUser?.uid || req.adminUser?.email || null,
    });

    res.json({ success: true, booking });
  } catch (err) {
    console.error("adminApproveBookingPayment error:", err);
    res.status(400).json({ success: false, error: err.message || "Failed to approve payment" });
  }
}

export async function adminRejectBookingPayment(req, res) {
  try {
    const booking = await updateBookingPaymentStatus({
      bookingId: req.params.bookingId,
      status: "rejected",
      approvedBy: req.adminUser?.uid || req.adminUser?.email || null,
    });

    res.json({ success: true, booking });
  } catch (err) {
    console.error("adminRejectBookingPayment error:", err);
    res.status(400).json({ success: false, error: err.message || "Failed to reject payment" });
  }
}
