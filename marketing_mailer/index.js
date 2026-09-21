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

const html = 
`
<html>
<body>
<h1>Confrim your email</h1>
</body>
</html>
`


const mailOptions = {
  from: process.env.GMAIL_USER,
  to: process.env.GMAIL_TO,
  subject: "Welcome to Inn Box!",
  html
};

const sendMail = async () => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch(e) {
    console.error(`An error occurred: ${e.message}`);
  }
}

sendMail();