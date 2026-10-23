import personasModule from "@/module/persona";
import userModule from "@/module/signup";
import { getUser } from "@/lib/getUser";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  await connectDB();
  const userAuth = await getUser();
  if (!userAuth || !userAuth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const findPersona = await personasModule.find();
  const userId = userAuth.user.id;
  const user = await userModule.findById(userId);

  return NextResponse.json({ persona: findPersona });
}
