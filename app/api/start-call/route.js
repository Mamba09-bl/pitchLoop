import personaModule from "@/module/persona";
import sessionModule from "@/module/session";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";
import { connectDB } from "@/lib/db";
import { isValidId } from "@/lib/validate";

export async function POST(req) {
  await connectDB();
  let { id, personaId } = await req.json();
  const userAuth = await getUser();
  if (!userAuth || !userAuth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isValidId(id) || !isValidId(personaId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  const userId = userAuth.user.id;
  //   const persona = await personaModule.findById(id);
  const session = await sessionModule.findOne({ _id: id, userId });
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  const persona = await personaModule.findById(personaId);

  // if (session.status === "completed") {
  //   return NextResponse.json(
  //     { success: false, error: "This session has already used both calls." },
  //     { status: 429 },
  //   );
  // }

  if (session.checkCallNumber >= 2) {
    return NextResponse.json(
      { success: false, limitReached: true },
      { status: 429 },
    );
  }

  if (session.checkCallNumber === 2) {
    session.status = "active";
  }

  const callNumber = session.callNumber === 2 ? 2 : 1;

  const startIndex = callNumber === 1 ? 0 : 3;
  const skillsCount = callNumber === 1 ? 3 : 2;

  const selectedSkills = persona.skillLibrary
    .slice(startIndex, startIndex + skillsCount)
    .map((skill) => skill.name);

  session.currentStage = selectedSkills[0];
  session.currentSkillIndex = 0;
  session.callNumber = callNumber;
  session.selectedSkills = selectedSkills;
  session.checkCallNumber += 1;
  session.callNumber = session.checkCallNumber;

  await session.save();

  console.log("BEFORE RESET:", {
    call: session.checkCallNumber,
    weak: session.weakResponseCount,
  });

  if (session.checkCallNumber === 2) {
    // Fresh call, fresh chances — the first call's weak answers shouldn't carry over.
    session.weakResponseCount = 0;
  }

  console.log("AFTER RESET:", {
    call: session.checkCallNumber,
    weak: session.weakResponseCount,
  });

  await session.save();

  console.log("AFTER SAVE:", {
    call: session.checkCallNumber,
    weak: session.weakResponseCount,
  });

  console.log("stageHehe", session.currentStage);
  console.log("currentSkillIndex:", session.currentSkillIndex);
  console.log("selectedSkills:", session.selectedSkills);
  console.log("length:", session.selectedSkills.length);
  console.log("sszsaa", persona);

  await session.save();
  return Response.json({
    success: true,
    checkCallNumber: session.checkCallNumber,
  });
}
