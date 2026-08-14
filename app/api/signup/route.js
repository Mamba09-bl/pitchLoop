import signup from "@/module/signup";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  await connectDB();
  const { username, email, password } = await req.json();

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
  console.log("i am from signup hehe", user);

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

  console.log("token", token);
  console.log("user", user);

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
