import { NextResponse } from "next/server";
import userModel from "@/module/signup";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";

const SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();
  const existing = await userModel.findOne({ email });
  if (!existing)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  const isMatch = await bcrypt.compare(password, existing.password);
  if (!isMatch)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  const token = jwt.sign({ id: existing._id, email: existing.email }, SECRET);
  const res = NextResponse.json({ success: true, message: "Login successful" });

  console.log(token);

  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
