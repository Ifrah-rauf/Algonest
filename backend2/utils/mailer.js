import nodemailer from "nodemailer";

export const senderMail =
  process.env.OFFICIAL_MAIL;

const senderMailPassword =
  process.env.OFFICIAL_MAIL_APP_PASS;

if (!senderMail || !senderMailPassword) {
  throw new Error("OFFICIAL_MAIL and OFFICIAL_MAIL_APP_PASS env variables are required");
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: senderMail,
    pass: senderMailPassword,
  },
});
