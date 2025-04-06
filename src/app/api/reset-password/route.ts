import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOTP, sendEmail } from "@/lib/utils";
import bcrypt from "bcryptjs";
import { cookies } from 'next/headers';

// Helper functions for OTP storage
const getOtpCookieName = (email: string) => `otp_${Buffer.from(email).toString('base64')}`;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    console.log("Processing password reset request for:", email);

    // Find doctor with this email
    const doctor = await prisma.doctor.findUnique({
      where: { Email: email },
    });

    if (!doctor) {
      console.log("No doctor found with email:", email);
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    console.log("Generated OTP for:", email);

    // Store OTP with timestamp (expires in 10 minutes)
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    
    // Store in cookies
    const cookieStore = cookies();
    const otpData = JSON.stringify({
      otp,
      timestamp: expiryTime,
    });
    
    cookieStore.set({
      name: getOtpCookieName(email),
      value: otpData,
      httpOnly: true,
      path: '/',
      expires: new Date(expiryTime),
      secure: process.env.NODE_ENV === 'production',
    });
    
    console.log("Stored OTP with expiry:", new Date(expiryTime).toISOString());

    // Send email with OTP
    try {
      await sendEmail({
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. This OTP will expire in 10 minutes.`,
      });
      console.log("OTP email sent successfully to:", email);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // Clean up stored OTP if email fails
      cookieStore.delete(getOtpCookieName(email));
      throw new Error(
        "Failed to send OTP email: " +
          (emailError instanceof Error ? emailError.message : "Unknown error")
      );
    }

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process password reset request",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();
    console.log("Processing OTP verification for:", email);

    // Verify OTP from cookies
    const cookieStore = cookies();
    const otpCookie = cookieStore.get(getOtpCookieName(email));
    
    if (!otpCookie || !otpCookie.value) {
      console.log("No OTP found for email:", email);
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }
    
    let storedData;
    try {
      storedData = JSON.parse(otpCookie.value);
    } catch (e) {
      console.error("Failed to parse OTP data:", e);
      return NextResponse.json(
        { error: "Invalid OTP data" },
        { status: 400 }
      );
    }

    const now = Date.now();
    const isExpired = now > storedData.timestamp;
    const isMatch = storedData.otp === otp;

    console.log("OTP validation:", {
      isMatch,
      isExpired,
      currentTime: new Date(now).toISOString(),
      expiryTime: new Date(storedData.timestamp).toISOString(),
    });

    if (!isMatch || isExpired) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.doctor.update({
      where: { Email: email },
      data: { password: hashedPassword },
    });
    console.log("Password updated successfully for:", email);

    // Clear OTP after successful password reset
    cookieStore.delete(getOtpCookieName(email));

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
