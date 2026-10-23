import { NextResponse } from "next/server";
import userModel from "@/module/signup";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import * as z from "zod";
import { validate } from "@/lib/validate";

const SECRET = process.env.JWT_SECRET;

const loginSchema = z.object({
  email: z.string().min(1).max(254),
  password: z.string().min(1).max(128),
});

export async function POST(req) {
  await connectDB();
  const { data } = validate(loginSchema, await req.json());
  if (!data) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }
  const { email, password } = data;
  const existing = await userModel.findOne({ email });
  if (!existing)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  const isMatch = await bcrypt.compare(password, existing.password);
  if (!isMatch)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  const token = jwt.sign({ id: existing._id, email: existing.email }, SECRET, {
    expiresIn: "30d",
  });
  const res = NextResponse.json({ success: true, message: "Login successful" });

  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
