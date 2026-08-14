import personasModule from "@/module/persona";
import userModule from "@/module/signup";
import { getUser } from "@/lib/getUser";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  await connectDB();
  const findPersona = await personasModule.find();
  const userAuth = await getUser();
  const userId = userAuth.user.id;
  const user = await userModule.findById(userId);
  console.log(user);

  return NextResponse.json({ persona: findPersona });
}
