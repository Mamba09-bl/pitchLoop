import OpenAI from "openai";
import personaModule from "@/module/persona";
import sessionModule from "@/module/session";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";
import { connectDB } from "@/lib/db";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

function cleanJsonResponse(content) {
  return content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

export async function GET(req) {
  try {
    await connectDB();
    const sessionId = req.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing session ID" },
        { status: 400 },
      );
    }

    const session = await sessionModule.findById(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 },
      );
    }

    const practice = session.practice;
    console.log(session.coaching);

    if (!practice || !practice.scenario) {
      return NextResponse.json({
        success: true,
        practice: null,
      });
    }

    return NextResponse.json({
      success: true,
      practice: {
        skillName: practice.skillName || "",
        scenario: practice.scenario || "",
        attempts: practice.attempts || 0,
        completed: practice.completed || false,
      },
    });
  } catch (error) {
    console.error("Practice API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load practice request" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const userAuth = await getUser();

    if (!userAuth || !userAuth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const action = body?.action;

    if (action === "generate") {
      const { skillName, whyItMatters, whatHappened, sessionId, personaId } =
        body;

      if (!skillName || !sessionId) {
        return NextResponse.json(
          { success: false, error: "Missing skill or session ID" },
          { status: 400 },
        );
      }
      const session = await sessionModule.findById(sessionId);
      session.practice.skillName = skillName;
      await session.save();

      if (!session) {
        return NextResponse.json(
          { success: false, error: "Session not found" },
          { status: 404 },
        );
      }
      session.practice.skillName = skillName;
      session.practice.attempts = 0;
      session.practice.completed = false;
      session.practice.answers = [];
      const resolvedPersonaId = session.personaId;
      const persona = resolvedPersonaId
        ? await personaModule.findById(resolvedPersonaId)
        : null;

      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 1.2,
        messages: [
          {
            role: "system",
            content: `You are an expert enterprise B2B sales coach.

Your job is to create ONE realistic sales practice scenario that tests ONLY the requested sales skill.

This is a completely NEW practice exercise.

It is NOT a continuation of any previous conversation.

==================================================
YOUR GOAL
==================================================

Generate a buyer message that forces the seller to demonstrate the requested skill.

The scenario should feel like it came from a real enterprise sales call.

==================================================
RULES
==================================================

Every scenario MUST be different.

Do NOT simply rewrite or paraphrase previous buyer questions.

Instead, create a NEW business situation.

Change as many of these as possible:

- buyer's concern
- buyer's mindset
- buyer's business problem
- buyer's urgency
- company situation
- company maturity
- company goals
- buyer's reason for being skeptical
- wording
- tone

For example, if the requested skill is Opening & Relevance, different scenarios might involve:

• the buyer believes they don't have the problem
• the buyer already uses another solution
• the buyer is too busy
• the buyer recently had a bad experience with another vendor
• the buyer thinks their current process is good enough
• the buyer doesn't understand why this matters
• the buyer believes the timing is wrong

Each practice scenario should require a DIFFERENT approach from the seller.

A seller should NOT be able to copy the same answer into multiple scenarios and receive full credit.

==================================================
SKILL FOCUS
==================================================

Practice ONLY this skill:

${skillName || "Unknown"}

Do NOT test other skills.

Do NOT combine multiple stages.

Do NOT ask follow-up questions.

Generate only ONE buyer message.

==================================================
BUYER
==================================================

The buyer should behave according to this persona.

Name:
${persona?.name || "Unknown"}

Description:
${persona?.description || ""}

Personality:
${persona?.personality || ""}

Stay consistent with this personality.

==================================================
PREVIOUS FEEDBACK
==================================================

Why this skill matters:

${whyItMatters || ""}

What happened previously:

${whatHappened || ""}

Use this ONLY to understand what the seller struggled with.

DO NOT recreate the previous conversation.

DO NOT reuse the same buyer question.

DO NOT copy the same objection.

Create a completely fresh situation.

==================================================
BUYER MESSAGE
==================================================

The buyer should sound like a busy professional.

The message should:

- be natural
- be conversational
- feel realistic
- contain ONE clear challenge
- be between 20 and 45 words

The buyer should challenge the seller in a way that naturally tests ONLY the requested skill.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

{
  "scenario": "..."
}

No markdown.

No explanations.

No extra text.`,
          },
          {
            role: "user",
            content: `Generate one short buyer message for the requested skill only.`,
          },
        ],
      });

      const reply = completion.choices?.[0]?.message?.content;

      if (!reply) {
        return NextResponse.json(
          { success: false, error: "No AI response received" },
          { status: 500 },
        );
      }

      const cleanedReply = cleanJsonResponse(reply);
      const parsed = JSON.parse(cleanedReply);
      console.log("scenario", parsed);
      session.practice.scenario = parsed.scenario;
      await session.save();
      return NextResponse.json({
        success: true,
        scenario: parsed.scenario || "",
        sessionAttempts: session.practice.attempts,
      });
    }

    if (action === "evaluate") {
      const {
        scenario,
        sellerAnswer,
        attemptNumber,
        skillName,
        sessionId,
        personaId,
      } = body;

      if (!scenario || !sellerAnswer || !skillName || !sessionId) {
        return NextResponse.json(
          { success: false, error: "Missing evaluation details" },
          { status: 400 },
        );
      }

      const session = await sessionModule.findById(sessionId);

      if (!session) {
        return NextResponse.json(
          { success: false, error: "Session not found" },
          { status: 404 },
        );
      }

      const resolvedPersonaId = personaId || session.personaId;
      const persona = resolvedPersonaId
        ? await personaModule.findById(resolvedPersonaId)
        : null;
      const currentAttempt = session.practice.attempts;
      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        // temperature: 0.2,
        messages: [
          {
            role: "system",
            content: `
You are a STRICT B2B sales practice evaluator.

Your ONLY job is to determine whether the seller successfully demonstrated the REQUESTED SKILL in response to the BUYER SCENARIO.

==================================================
REQUESTED SKILL
==================================================

${skillName}

==================================================
BUYER SCENARIO
==================================================

${scenario}

==================================================
SELLER ANSWER
==================================================

${sellerAnswer}

==================================================
CURRENT DATABASE ATTEMPT
==================================================

The current attempt count comes from the database:

${session.practice.attempts}

IMPORTANT:

The database attempt count is the source of truth.

Do NOT calculate, modify, or guess the attempt number.

If the database attempt count is 4, this is the FINAL attempt.

==================================================
STRICT EVALUATION
==================================================

The seller must directly address the buyer's actual challenge.

PASS the answer ONLY if the seller clearly demonstrates the requested skill.

Do NOT pass an answer simply because it:

- sounds professional
- sounds confident
- uses sales language
- mentions the product
- acknowledges the buyer
- contains relevant words

The seller must actually accomplish the objective of the requested skill.

FAIL the answer if ANY of these are true:

- The seller avoids the buyer's actual concern.
- The seller changes the subject.
- The seller asks another question instead of answering.
- The seller gives generic sales language.
- The seller gives a vague response.
- The seller gives a response that could apply to almost any buyer.
- The seller acknowledges the concern but does not actually address it.
- The seller gives information unrelated to the buyer's challenge.
- The seller's answer does not demonstrate the requested skill.
- The seller partially addresses the concern but leaves the core objection unanswered.
- The seller gives a reasonable sales response but it does not satisfy the specific skill being tested.

Do NOT reward partial completion.

==================================================
WHAT TO IGNORE
==================================================

Ignore:

- grammar mistakes
- pronunciation
- filler words
- minor wording mistakes
- imperfect sentence structure

Focus ONLY on whether the seller successfully demonstrated the requested skill.

==================================================
FINAL ATTEMPT RULE
==================================================

If the seller PASSES:

Return ONLY:

{
  "passed": true
}

If the seller FAILS and the database attempt count is LESS THAN 4:

Return ONLY:

{
  "passed": false
}

If the seller FAILS and the database attempt count is EXACTLY 4:

Return:

{
  "passed": false,
  "idealAnswer": "...",
  "explanation": "..."
}

IMPORTANT:

Only return "idealAnswer" and "explanation" when:

${currentAttempt} === 4

Do NOT return idealAnswer or explanation before the fourth attempt.

==================================================
IDEAL ANSWER
==================================================

When the attempt count is 4 and the seller failed:

The idealAnswer must directly answer the BUYER'S SPECIFIC challenge.

It must demonstrate the REQUESTED SKILL.

It must NOT be a generic sales answer.

It must be realistic for this exact buyer scenario.

Do not mention that it is an ideal answer.

==================================================
EXPLANATION
==================================================

When the attempt count is 4 and the seller failed:

Briefly explain:

1. What the seller failed to address.
2. Why the answer did not demonstrate the requested skill.
3. What the ideal answer does differently.

Do NOT criticize grammar or wording.

Focus on the sales skill.

==================================================
BUYER PERSONA
==================================================

Name:
${persona?.name || "Unknown"}

Description:
${persona?.description || ""}

Personality:
${persona?.personality || ""}

Use the persona only to make the evaluation realistic.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

No markdown.

No explanations outside the JSON.

No additional fields.
`,
          },
          {
            role: "user",
            content: "Evaluate the seller answer using the rules above.",
          },
        ],
      });

      const reply = completion.choices?.[0]?.message?.content;

      if (!reply) {
        return NextResponse.json(
          { success: false, error: "No AI response received" },
          { status: 500 },
        );
      }

      const cleanedReply = cleanJsonResponse(reply);
      const parsed = JSON.parse(cleanedReply);
      session.practice.answers.push({
        answer: sellerAnswer,
        correct: parsed.correct,
      });

      await session.save();
      console.log("practicessa", parsed);

      if (parsed.passed) {
        session.practice.completed = true;
        const skill = session.coaching.skills.find(
          (item) => item.name === skillName,
        );

        if (skill) {
          skill.practiceCompleted = true;
        }

        await session.save();

        return NextResponse.json({ success: true, passed: true });
      }

      if (!parsed.passed) {
        session.practice.attempts += 1;
        await session.save();
      }
      await session.save();

      console.log(session.practice);

      if (currentAttempt >= 4) {
        return NextResponse.json({
          success: true,
          passed: false,
          idealAnswer: parsed.idealAnswer || "",
          explanation: parsed.explanation || "",
          sessionAttempts: session.practice.attempts,
        });
      }

      return NextResponse.json({
        success: true,
        passed: false,
        currentAttempt,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Practice API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process practice request" },
      { status: 500 },
    );
  }
}
