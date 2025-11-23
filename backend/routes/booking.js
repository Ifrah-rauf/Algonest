import express from "express";
import { transporter } from "../utils/mailer.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const booking = req.body;
    const mail = "ifrahraufddps@gmail.com"
    console.log("Received booking:", booking);

    // Send confirmation email
    await transporter.sendMail({
      from: `"AlgoNest" <${mail}>`,
      to: booking.email,
      subject: "Your AlgoNest Booking is Confirmed 🎉",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color:#6b46c1">Your booking is Confirmed for ${booking.plan}</h2>
          <p>Hi ${booking.username},</p>
          <p>Thanks for booking with <strong>AlgoNest</strong>.</p>

          <div style="background:#f7f7f7;padding:15px;border-radius:10px;">
            <p><strong>Name:</strong> ${booking.username} ${booking.lastname}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Contact:</strong> ${booking.contact}</p>
            <p><strong>Requirement:</strong> ${booking.req}</p>
            <p><strong>Role:</strong> ${booking.role}</p>
          </div>

          <p style="margin-top:20px;">Our team will reach out soon!</p>
          <p>Regards,<br/>AlgoNest Team</p>
        </div>
      `
    });

    return res.json({ success: true, message: "Booking created & email sent!" });

  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ success: false, message: "Email failed", error });
  }
});

export default router;
