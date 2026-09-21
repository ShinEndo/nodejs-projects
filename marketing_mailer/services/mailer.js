import dotenv from "dotenv";
import { createTransport } from "nodemailer";
dotenv.config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  }
});

export const sendMail = async (to, html) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: "Welcome to Inn Box!",
    html
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch(e) {
    console.error(`An error occurred: ${e.message}`);
  }
}