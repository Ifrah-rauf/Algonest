import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: process.env.GMAIL_USER,       
    // pass: process.env.GMAIL_APP_PASS,   
    user: process.env.SENDER_MAIL || "algonest.edtech@gmail.com",
    pass:"opwj xzvc fvnr jnze"
  },
});
