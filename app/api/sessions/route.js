import { NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";
import sessionModule from "@/module/session";
import personaModule from "@/module/persona";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  try {
    await connectDB();
    const userAuth = await getUser();

    if (!userAuth || !userAuth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = userAuth.user.id;

    // Fetch all sessions for the user, sorted by newest first
    const sessions = await sessionModule
      .find({ userId })
      .populate("personaId")
      .sort({ createdAt: -1 });

    // console.log(JSON.stringify(msgSession, null, 2));
    const allSession = await sessionModule.findById(userId);
    console.log("iamallsessionss", sessions);
    // Transform sessions to match frontend requirements
    const formattedSessions = sessions.map((session) => {
      const persona = session.personaId;
      const duration = calculateDuration(session.messages);

      if (!persona) {
        // console.log("Missing persona for session:", session._id);
      }

      const calls = (session.voiceCallFeedback || [])
        .map((entry) => ({
          callNumber: entry.callNumber,
          score: entry.overallScore?.score || 0,
        }))
        .sort((a, b) => a.callNumber - b.callNumber);

      const latestCallScore = calls.length
        ? calls[calls.length - 1].score
        : null;

      return {
        id: session._id.toString(),
        personaName: persona?.name || "Unknown Persona",
        personaTitle: persona
          ? `${persona.job} at ${persona.company}`
          : "Unknown Persona",
        date: session.createdAt?.toISOString().split("T")[0] || "No Date",
        score: latestCallScore ?? (session.feedback?.overallScore || 0),
        duration,
        status: session.status === "completed" ? "Completed" : "In Progress",
        calls,
      };
    });

    return NextResponse.json({
      sessions: formattedSessions,
      total: formattedSessions.length,
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Helper function to calculate duration in MM:SS format
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
