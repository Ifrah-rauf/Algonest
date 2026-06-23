import nodemailer from "nodemailer";

export const senderMail =
  process.env.OFFICIAL_MAIL;

const senderMailPassword =
  process.env.OFFICIAL_MAIL_APP_PASS;

const mailerConfigured = Boolean(senderMail && senderMailPassword);

if (!mailerConfigured) {
  console.warn("OFFICIAL_MAIL and OFFICIAL_MAIL_APP_PASS are not configured; email sending is disabled.");
}

const configuredTransporter = mailerConfigured
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderMail,
        pass: senderMailPassword,
      },
    })
  : null;

export const transporter = {
  async sendMail(...args) {
    if (!configuredTransporter) {
      throw new Error("Email service is not configured");
    }

    return configuredTransporter.sendMail(...args);
  },
};
