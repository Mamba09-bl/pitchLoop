import OpenAI from "openai";
import personaModule from "@/module/persona";
import sessionModule from "@/module/session";
import userModule from "@/module/signup";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";
import { connectDB } from "@/lib/db";

const grook = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 8-Skill Evaluation for Complete Conversation
async function evaluateFullConversation(session) {
  const conversation = session.messages
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");
  // console.log(conversation);

  const completion = await grook.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: `
        You are an expert B2B sales coach with years of experience coaching enterprise sales representatives.

Your job is to analyze the COMPLETE sales conversation between the buyer (assistant) and the seller (user).

Analyze the ENTIRE conversation before making any judgement.

Never evaluate only the latest message.

====================================================
SKILLS TO EVALUATE
====================================================

Evaluate ONLY these eight skills.

1. Opening & Relevance
2. Value Proposition
3. Discovery
4. Pain Connection
5. Differentiation
6. Existing Solution
7. ROI & Business Value
8. Implementation Concern

Do NOT invent additional skills.

====================================================
HOW TO EVALUATE
====================================================

For every skill decide one of:

- Strong
- Needs Improvement
- Not Evaluated

Strong

The seller demonstrated the skill naturally and effectively.

Needs Improvement

The skill appeared during the conversation but the seller failed to demonstrate it effectively.

Not Evaluated

The conversation never naturally reached this skill.

Never invent feedback for a skill that never occurred.

====================================================
IMPORTANT
====================================================

Your job is NOT to coach.

Your job is ONLY to explain WHY.

Do NOT tell the seller what they should have said.

Do NOT rewrite the seller's answer.

Do NOT give better wording.

Do NOT provide examples.

Do NOT provide coaching.

Instead explain WHY the seller succeeded or struggled.

The explanation should feel like feedback from an experienced sales manager reviewing a real sales call.

====================================================
GOOD EXAMPLES
====================================================

Good

"The seller immediately began explaining product features without first understanding the buyer's current engineering process."

Good

"The seller discussed product capabilities but never connected them to measurable business outcomes."

Good

"The seller responded to the buyer's objection but failed to clearly explain why the product was meaningfully different from the buyer's current solution."

====================================================
BAD EXAMPLES
====================================================

Bad

"You should have..."

Bad

"A better answer would be..."

Bad

"You could say..."

Bad

"The correct response is..."

====================================================
SKILL FEEDBACK REQUIREMENTS
====================================================

For every skill return BOTH:

1. whyItMatters

Explain why this skill is important in a real sales conversation.

Do NOT mention this conversation.

Explain the business consequence if the seller performs this skill poorly.

Example:

"If buyers cannot clearly understand why your product is different, they are more likely to compare solutions only on price instead of value."

Keep this between 1 and 2 sentences.

----------------------------------------------------

2. whatHappened

Explain what actually happened during THIS conversation.

Reference specific moments from the conversation.

Describe why the seller demonstrated or struggled with the skill.

Do NOT coach.

Do NOT rewrite the answer.

Do NOT suggest improvements.

Do NOT provide examples.

Simply explain what happened.

Example:

"When the buyer asked why the platform was different from existing tools, the seller described product capabilities but never explained why those capabilities created a meaningful advantage over the buyer's current solution."

Keep this between 2 and 4 sentences.

----------------------------------------------------

The difference is:

whyItMatters
= Why this skill matters in general.

whatHappened
= What happened in THIS conversation.

Never mix them together.
====================================================
OVERALL SUMMARY
====================================================

Write a concise summary of the overall sales performance.

Mention:

- biggest strength
- biggest weakness
- overall communication quality

Keep it under 120 words.

====================================================
OUTPUT
====================================================

Return ONLY valid JSON.

{
  "overallSummary": "...",
  "skills": [
    {
      "name": "Opening & Relevance",
      "status": "Strong",
      "reason": "..."
    }
  ]
}

Return ONLY JSON.

No markdown.

No explanations.

No extra text.
        `,
      },
      {
        role: "user",
        content: conversation,
      },
    ],
    temperature: 0.3,
  });

  const reply = completion.choices[0].message.content;
  if (!reply) {
    throw new Error("No AI response received");
  }

  const cleanedReply = reply
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return JSON.parse(cleanedReply);
}

export async function POST(req) {
  await connectDB();
  let { id, personaId, evaluateFull } = await req.json();
  const userAuth = await getUser();
  if (!userAuth || !userAuth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = userAuth.user.id;
  const user = await userModule.findById(userId);
  const session = await sessionModule.findById(id);
  const persona = await personaModule.findById(personaId);
  if (session.checkCallNumber < 2) {
    return NextResponse.json(
      {
        success: false,
        error: "Complete both calls before accessing coaching.",
      },
      { status: 403 },
    );
  }
  // If evaluateFull is true, run the comprehensive 8-skill evaluation
  if (id) {
    try {
      const evaluation = await evaluateFullConversation(session);
      console.log("responseaw", evaluation);

      // Save coaching evaluation to session
      session.coaching = evaluation;
      await session.save();

      return NextResponse.json({ evaluation });
    } catch (error) {
      console.error("Full evaluation error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to evaluate conversation" },
        { status: 500 },
      );
    }
  }

  return Response.json({
    session,
  });
}

// export async function GET(req) {
//   try {
//     const sessionId = req.nextUrl.searchParams.get("sessionId");

//     if (!sessionId) {
//       return NextResponse.json(
//         { success: false, error: "Missing session ID" },
//         { status: 400 },
//       );
//     }

//     const session = await sessionModule.findById(sessionId);

//     if (session.callNumber < 2) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Complete both calls before accessing coaching.",
//         },
//         { status: 403 },
//       );
//     }
//     if (!session) {
//       return NextResponse.json(
//         { success: false, error: "Session not found" },
//         { status: 404 },
//       );
//     }

//     console.log("zaaza", session.coaching);

//     // if (!session.coaching) {
//     //   return NextResponse.json(
//     //     { success: false, error: "Coaching not found" },
//     //     { status: 404 },
//     //   );
//     // }

//     // if (session.practice.complete == true) {
//     //   return NextResponse.json({
//     //     success: true,
//     //     coaching: "practiceDone",
//     //   });
//     // }

//     return NextResponse.json({
//       success: true,
//       coaching: session.coaching,
//       practice: session.practice,
//     });
//   } catch (error) {
//     console.error("Coaching fetch error:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch coaching" },
//       { status: 500 },
//     );
//   }
// }

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
    const userAuth = await getUser();
    const userId = userAuth.user.id;

    const session = await sessionModule.findById(sessionId);
    const ownId = await sessionModule.findOne({
      userId: userId,
      _id: sessionId,
    });
    if (!ownId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 },
      );
    }

    // Check AFTER getting the session
    if (session.checkCallNumber < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Complete both calls before accessing coaching.",
        },
        { status: 403 },
      );
    }
    if (!userAuth || !userAuth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await userModule.findById(userId);
    console.log("zaaza", session.feedback);

    return NextResponse.json({
      success: true,
      coaching: session.coaching,
      practice: session.practice,
    });
  } catch (error) {
    console.error("Coaching fetch error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch coaching" },
      { status: 500 },
    );
  }
}
