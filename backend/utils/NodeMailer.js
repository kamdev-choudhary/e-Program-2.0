import nodemailer from "nodemailer";
import config from "../config/config";

const transporter = nodemailer.createTransport({
  host: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_APP_PASSWORD,
  },
});

export async function sendMail({ to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: config.GMAIL_USER,
    to: to,
    subject: subject || "No Subject",
    text: text || "",
    html: html || "",
  });

  console.log("Message sent: %s", info.messageId);
}
