import sessionModule from "@/module/session";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUser } from "@/lib/getUser";
import { isValidId } from "@/lib/validate";

export async function GET(req) {
  await connectDB();
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  const callNumberParam = req.nextUrl.searchParams.get("callNumber");

  const userAuth = await getUser();
  if (!userAuth || !userAuth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isValidId(sessionId)) {
    return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
  }
  const userId = userAuth.user.id;
  const session = await sessionModule.findOne({
    userId: userId,
    _id: sessionId,
  });
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  const messages = callNumberParam
    ? session.messages.filter(
        (message) => message.callNumber === Number(callNumberParam),
      )
    : session.messages;

  const duration = calculateDuration(messages);

  const requestedCallNumber = callNumberParam
    ? Number(callNumberParam)
    : session.callNumber;

  const voiceFeedbackEntry = (session.voiceCallFeedback || []).find(
    (entry) => entry.callNumber === requestedCallNumber,
  );

  const score =
    voiceFeedbackEntry?.overallScore?.score ??
    session.feedback?.overallScore ??
    0;

  return NextResponse.json({
    messages,
    sessionTime: duration,
    score,
    latestCallNumber: session.callNumber,
  });
}

function calculateDuration(messages) {
  if (!messages || messages.length === 0) {
    return "0:00";
  }

  const firstMessage = messages[0].createdAt;
  const lastMessage = messages[messages.length - 1].createdAt;

  const durationMs = new Date(lastMessage) - new Date(firstMessage);
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
