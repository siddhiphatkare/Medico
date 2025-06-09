const nodemailer = require("nodemailer");
require('dotenv').config();

async function sendTestEmail() {
  if (!process.env.MAILER_USER || !process.env.MAILER_PASSWORD) {
    console.log("Mailer credentials are not set in environment variables");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.MAILER_USER,
      to: process.env.MAILER_USER,
      subject: "Test Email from Medico App",
      text: "This is a test email to verify nodemailer setup.",
    });
    console.log("Test email sent: ", info);
  } catch (error) {
    console.error("Error sending test email: ", error);
  }
}

sendTestEmail();
