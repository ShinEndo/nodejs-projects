import dotenv from "dotenv";
import { scheduleJob } from "node-schedule";
import { campaignMail } from "../mailTemplates.js";
import { sendMail } from "./mailer.js";
dotenv.config();

export const schedule = (timeOptions) => {
  scheduleJob(timeOptions, async () => {
    await sendMail(
      process.env.GMAIL_USER,
      campaignMail("Special Promotion", "promo1", process.env.GMAIL_TO)
    );
  });
}