import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  const userAuth = await getUser();
  if (!userAuth || !userAuth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const clientSecret = await openai.realtime.clientSecrets.create({
      session: {
        type: "realtime",
        model: "gpt-realtime-1.5",
      },
    });

    return NextResponse.json({
      value: clientSecret.value,
      expires_at: clientSecret.expires_at,
    });
  } catch (error) {
    console.error("Failed to create Realtime client secret:", error);
    return NextResponse.json(
      { error: "Failed to create realtime session" },
      { status: 500 },
    );
  }
}
