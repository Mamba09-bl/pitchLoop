import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode("MY_SUPER_SECRET_123");

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (token) {
    await jwtVerify(token, SECRET);
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/personas/:path*",
    "/Analytics/:path*",
    "/profile/:path*",
    "/history/:path*",
    "/chat/:path*",
    "/coaching/:path*",
    "/practice/:path*",
    "/pre-call/:path*",
    "/voice/:path*",
    "/voicePersona/:path*",
    "/voice-feedback/:path*",
    "/transcript/:path*",
    "/end-session/:path*",
  ],
};
