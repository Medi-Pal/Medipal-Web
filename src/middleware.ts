import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Redirect root to appropriate page based on auth status
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(
        new URL("/doctor/prescription", request.url)
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protected doctor routes
  if (pathname.startsWith("/doctor")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (token.role !== "doctor") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Prevent authenticated users from accessing auth pages
  if (
    (pathname.startsWith("/login") || pathname === "/forgot-password") &&
    token
  ) {
    return NextResponse.redirect(new URL("/doctor/prescription", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
