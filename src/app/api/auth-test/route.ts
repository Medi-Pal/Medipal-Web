import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth-options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      status: "success",
      authenticated: !!session,
      session: session ? {
        user: {
          ...session.user,
          // Don't expose sensitive data if exists
          email: session.user?.email ? "***@***" : null,
        },
        expires: session.expires,
      } : null,
      env: {
        nextAuthUrl: !!process.env.NEXTAUTH_URL,
        nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        databaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  } catch (error) {
    console.error("Auth test error:", error);
    return NextResponse.json({
      status: "error",
      message: "Authentication test failed",
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
} 