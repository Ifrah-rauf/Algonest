import * as bookingService from "../services/bookingService.js";

export async function createBooking(req, res) {
  try {
    const result = await bookingService.createBooking(req.body);
    res.json({ success: true, message: "Booking created & email sent!", result });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ success: false, message: "Email failed", error });
  } 
}

export async function bookingMail(req, res) {
  try {
    const result = await bookingService.bookingMail(req.body);
    res.json({ success: true, message: "Email sent successfully!", result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Email failed", error: error.message });
  }
}

export async function getPlan(req, res) {
  try {
    const result = await bookingService.getPlan(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

export async function getTimeSlots(req, res) {
  try {
    const result = await bookingService.getTimeSlots(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

export async function bookPlanCore(req, res) {
  try {
    const result = await bookingService.bookPlanCore(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server crash", error: err });
  }
}
