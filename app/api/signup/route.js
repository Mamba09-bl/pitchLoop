import signup from "@/module/signup";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import * as z from "zod";
import { validate } from "@/lib/validate";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Same rules as the signup form
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or fewer"),
  email: z.string().trim().max(254).regex(EMAIL_RE, "Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be 128 characters or fewer"),
});

export async function POST(req) {
  await connectDB();
  const { data, error } = validate(signupSchema, await req.json());
  if (error) return error;
  const { username, email, password } = data;

  const existing = await signup.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 400 },
    );
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await signup.create({
    username,
    email,
    password: hash,
  });

  // ✅ CREATE & SIGN JWT PROPERLY
  const token = await new SignJWT({
    id: user._id.toString(),
    email: user.email,
    username: user.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);


  const res = NextResponse.json({ success: true }, { status: 201 });

  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
