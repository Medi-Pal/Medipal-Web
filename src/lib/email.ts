import nodemailer from "nodemailer";

// In production, you'd use real email credentials
// For development, we can use a test account or ethereal.email service
let transporter: nodemailer.Transporter;

// Initialize email transporter
export async function initEmailTransporter() {
  if (transporter) return transporter;

  // Add debugging to help troubleshoot .env settings
  console.log("Email setup: Checking for SMTP settings in environment...");
  console.log("EMAIL_HOST exists:", !!process.env.EMAIL_HOST);
  console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
  console.log("EMAIL_PASSWORD exists:", !!process.env.EMAIL_PASSWORD);
  console.log("EMAIL_PORT value:", process.env.EMAIL_PORT);
  console.log("EMAIL_SECURE value:", process.env.EMAIL_SECURE);

  // Always use the SMTP settings from .env if they exist
  if (
    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASSWORD
  ) {
    console.log(
      "Using configured SMTP server for emails:",
      process.env.EMAIL_HOST
    );

    const transportConfig = {
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    };

    console.log("Email transport config:", {
      ...transportConfig,
      auth: { ...transportConfig.auth, pass: "[HIDDEN]" },
    });

    try {
      transporter = nodemailer.createTransport(transportConfig);

      // Verify the connection
      await transporter.verify();
      console.log("SMTP connection verified successfully!");

      return transporter;
    } catch (error) {
      console.error(
        "Error creating email transporter with provided settings:",
        error
      );
      console.log(
        "Falling back to Ethereal test account due to SMTP configuration error"
      );
    }
  } else {
    // Fallback to Ethereal for testing if no SMTP settings
    console.log("No SMTP settings found, using Ethereal test account");
  }

  // Create Ethereal test account as fallback
  try {
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log("Using test email account:", testAccount.user);
    return transporter;
  } catch (error) {
    console.error("Error creating Ethereal test account:", error);
    throw new Error("Failed to create email transporter");
  }
}

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  try {
    const emailTransporter = await initEmailTransporter();

    const messageOptions = {
      from: `"Medipal" <${
        process.env.EMAIL_FROM ||
        process.env.EMAIL_USER ||
        "noreply@medipal.com"
      }>`,
      to,
      subject,
      text,
      html,
    };

    console.log("Sending email with options:", {
      ...messageOptions,
      text: text ? "[TEXT CONTENT]" : undefined,
      html: html ? "[HTML CONTENT]" : undefined,
    });

    const info = await emailTransporter.sendMail(messageOptions);

    // Log the URL to view email in development mode (ethereal.email)
    if (info.messageId) {
      console.log(
        "Email sent successfully to",
        to,
        "with message ID:",
        info.messageId
      );
      if (nodemailer.getTestMessageUrl(info)) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
