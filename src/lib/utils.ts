import nodemailer from "nodemailer";

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

interface EmailParams {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: EmailParams) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error(
      "Failed to send email: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
