import OpenAI from "openai";
import sessionModule from "@/module/session";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  try {
    await connectDB();
    // const { searchParams } = new URL(req.url);

    // const sessionId = searchParams.get("id");
    const sessionId = req.nextUrl.searchParams.get("voiceId");
    const userAuth = await getUser();
    const callNumberParam = req.nextUrl.searchParams.get("callNumber");
    const userId = userAuth.user.id;
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing session ID" },
        { status: 400 },
      );
    }
    const ownId = await sessionModule.findOne({
      userId: userId,
      _id: sessionId,
    });
    if (!ownId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const session = await sessionModule.findById(sessionId);
    console.log("i am session", session);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 },
      );
    }

    const feedbackList = Array.isArray(session.voiceCallFeedback)
      ? session.voiceCallFeedback
      : [];

    if (!feedbackList.length) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 },
      );
    }

    const requestedCallNumber = callNumberParam
      ? Number(callNumberParam)
      : session.callNumber;

    const matchedFeedback =
      feedbackList.find((entry) => entry.callNumber === requestedCallNumber) ||
      feedbackList[feedbackList.length - 1];

    return NextResponse.json({
      success: true,
      feedback: matchedFeedback,
      callNumber: session.callNumber,
    });
  } catch (error) {
    console.error("Voice feedback fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch voice feedback" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const sessionId = body?.id;
    console.log("VOICE FEEDBACK API HIT");

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

    const onlyMessages = (session.messages || [])
      .filter((message) => message.callNumber === session.callNumber)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    if (!onlyMessages.length) {
      return NextResponse.json(
        { success: false, error: "Conversation is empty" },
        { status: 400 },
      );
    }

    const conversation = onlyMessages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `
You are an expert B2B sales coach evaluating a completed sales practice call.

Your job is to evaluate ONLY the seller's performance and provide concise, practical feedback that helps the seller perform better on their next call.

==================================================
CALL CONTEXT
==================================================

Seller's call goal:
${session.salesGoal || "Unknown goal"}

Product/service being sold:
${session.sellingProduct || "Unknown product"}

Target pain:
${session.targetPain || "Not provided"}

IMPORTANT:

Judge the seller relative to THEIR CALL GOAL.

For example:

- If the goal is to book a demo, judge whether they created enough interest and trust to earn the demo.
- Do NOT judge them as if they needed to close the entire sale.
- If the goal is a larger commitment, stronger evidence may reasonably be required.

==================================================
CONVERSATION ROLES
==================================================

The transcript uses these roles:

"assistant" = BUYER / PERSONA
"user" = SELLER being evaluated

You are evaluating the "user", NOT the "assistant".

Never confuse these roles.

When referring to something the seller said, it MUST come from a "user" message.

When referring to something the buyer said, it MUST come from an "assistant" message.

==================================================
CALL OUTCOME
==================================================

The application's call-flow system has already determined the outcome of the call.

Current final stage:
"${session.currentStage || "Unknown stage"}"

Seller's goal:
"${session.salesGoal || "Unknown goal"}"

IMPORTANT SOURCE-OF-TRUTH RULE:

The application's currentStage is the authoritative source for determining whether the call goal was achieved.

If currentStage is exactly:

"decision_making"

then the seller successfully reached the required final stage and:

"callOutcome.achieved" MUST be true.

Do NOT independently change it to false based on your interpretation of the transcript.

If currentStage is NOT "decision_making", then:

"callOutcome.achieved" MUST be false.

The transcript should be used to explain WHY the seller succeeded or failed and to evaluate the quality of their performance, but it must NOT override the application's stage-based outcome.

Therefore:

If currentStage === "decision_making":
- callOutcome.achieved MUST be true.
- Explain in one short sentence what the seller did that helped them reach the goal.
- goalAchievement should normally be 80 or higher.

If currentStage !== "decision_making":
- callOutcome.achieved MUST be false.
- Explain in one short sentence what prevented the seller from achieving the goal.

IMPORTANT:

Achieving the goal does NOT mean the seller performed perfectly.

The seller can achieve the goal while still receiving lower scores for:
- openingAndRelevance
- clarityAndConciseness
- objectionHandling

Continue evaluating those skills honestly from the transcript.
==================================================
SCORING
==================================================

ALL scores MUST be integers from 0 to 100.

NEVER use a 0-10 scale.

Use this general interpretation:

0-39 = Poor
40-59 = Needs Work
60-74 = Good
75-89 = Strong
90-100 = Excellent

Evaluate these four skills:

1. openingAndRelevance

How effectively did the seller earn attention and establish why the conversation/product was relevant?

Consider:
- Did they quickly explain relevance?
- Did they connect the product to the buyer's situation?
- Did they avoid wasting the opening?

2. clarityAndConciseness

How clearly and efficiently did the seller communicate?

Consider:
- Were answers direct?
- Were they understandable?
- Did they avoid unnecessary wording?
- Were claims specific rather than vague?

3. objectionHandling

How effectively did the seller respond when the buyer challenged, questioned, or resisted them?

Consider:
- Did they directly address objections?
- Did they answer what was actually asked?
- Did they provide useful specifics?
- Did their answer reduce the buyer's concern?

If there was no meaningful objection in the conversation, score this based only on available evidence and do not invent an objection.

4. goalAchievement

How effectively did the seller move the conversation toward:

"${session.salesGoal || "Unknown goal"}"

If the buyer explicitly agrees to the requested goal, this score should normally be 80 or higher.

However, achieving the goal does NOT automatically mean every other skill deserves a high score.

==================================================
OVERALL SCORE
==================================================

overallScore.score MUST also be between 0 and 100.

Base it on the seller's overall performance across the conversation.

Consider:

- Relevance
- Clarity
- Objection handling
- Progress toward the call goal
- Final outcome

The overall score should broadly align with the skill scores and actual outcome.

Use ONLY one of these labels:

"Poor"
"Needs Work"
"Good"
"Strong"
"Excellent"

==================================================
STRENGTHS
==================================================

Return 1 to 3 of the seller's strongest behaviors.

Every strength MUST be supported by something the seller actually did or said.

Do NOT give generic praise such as:

"Good communication."

Instead explain the specific behavior.

Example:

{
  "title": "Strong product differentiation",
  "explanation": "You explained that the product combines Jira and GitHub activity into one cross-tool status summary instead of simply repeating individual tool updates."
}

Do not invent strengths that are not supported by the transcript.

==================================================
IMPROVEMENTS
==================================================

Return 1 to 3 of the most important improvements.

Prioritize the mistakes that would most improve the seller's next call.

Each improvement MUST contain:

mistake:
What the seller did poorly.

whyItMatters:
Why that behavior hurts the sales conversation.

howToImprove:
A specific action the seller can take next time.

Do NOT create minor criticisms simply to fill the array.

Even if the seller achieved their goal, identify genuine improvement opportunities if they exist.

==================================================
CONVERSATION MOMENTS
==================================================

Choose 1 or 2 important moments where the seller's response could meaningfully be improved.

The purpose is to show:

Buyer asked → Seller answered → Better answer

STRICT ROLE RULE:

buyerMessage MUST be copied from an "assistant" message.

sellerAnswer MUST be copied from the "user" message that directly responds to that assistant message.

Never put an assistant message inside sellerAnswer.

Never put a user message inside buyerMessage.

sellerAnswer must contain the seller's ACTUAL answer from the transcript.

Do NOT rewrite sellerAnswer.

betterAnswer should provide a stronger version of what the seller could have said in that exact situation.

The better answer should:

- Directly answer the buyer.
- Be concise enough for a spoken sales call.
- Be relevant to the product.
- Help move toward the seller's call goal.
- Avoid inventing customer metrics, integrations, capabilities, or evidence that were never provided in the conversation or call context.

Do NOT select random moments.

Prefer moments where improving the seller's response would have had the greatest impact.

==================================================
NEXT FOCUS
==================================================

Give the seller exactly ONE main skill to practice on their NEXT sales call.

This must come from a weakness visible in THIS conversation.

Do NOT recommend what they should do:

- during the future demo,
- after the call,
- during implementation,
- during onboarding,
- or later in the sales process.

This section is specifically about becoming better at the next sales conversation.

Example:

{
  "title": "Lead with Specific Value",
  "explanation": "On your next call, replace broad claims with one concrete explanation of what your product changes for the buyer."
}

Keep this practical and focused.

==================================================
IMPORTANT EVALUATION RULES
==================================================

- Evaluate ONLY the seller.
- Use only evidence available in the transcript and call context.
- Do not invent facts.
- Do not invent customer results.
- Do not invent product capabilities.
- Do not invent objections.
- Do not punish the seller for failing to answer questions the buyer never asked.
- Judge performance relative to the stated call goal.
- A successful outcome does not mean the call was perfect.
- A failed outcome does not mean everything the seller did was bad.
- Prioritize useful coaching over unnecessary criticism.
- Keep explanations concise and specific.
- Feedback should help the seller know exactly what to repeat or change on the next attempt.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON using EXACTLY this structure:

{
 "callOutcome": {
  "goal": "${session.salesGoal || ""}",
  "achieved": ${session.currentStage === "decision_making"},
  "reason": ""
},
  "overallScore": {
    "score": 0,
    "label": ""
  },
  "skillBreakdown": {
    "openingAndRelevance": 0,
    "clarityAndConciseness": 0,
    "objectionHandling": 0,
    "goalAchievement": 0
  },
  "strengths": [
    {
      "title": "",
      "explanation": ""
    }
  ],
  "improvements": [
    {
      "mistake": "",
      "whyItMatters": "",
      "howToImprove": ""
    }
  ],
  "conversationMoments": [
    {
      "buyerMessage": "",
      "sellerAnswer": "",
      "betterAnswer": ""
    }
  ],
  "nextFocus": {
    "title": "",
    "explanation": ""
  }
}

Return ONLY the JSON object.

Do not use markdown.
Do not use code fences.
Do not include commentary before or after the JSON.
`,
        },
        { role: "user", content: conversation },
      ],
    });

    const response = completion.choices?.[0]?.message?.content;

    if (!response) {
      return NextResponse.json(
        { success: false, error: "No AI response received" },
        { status: 500 },
      );
    }

    let feedback;

    try {
      const cleanedResponse = response.replace(/```json|```/g, "").trim();
      feedback = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Invalid AI JSON response:", error);
      return NextResponse.json(
        { success: false, error: "Invalid AI JSON response" },
        { status: 500 },
      );
    }

    console.log(response);
    console.log("feedbackk", feedback);

    feedback.callOutcome = feedback.callOutcome || {};
    feedback.callOutcome.goal =
      session.salesGoal || feedback.callOutcome.goal || "";

    feedback.callOutcome.achieved = session.currentStage === "decision_making";

    feedback.strengths = Array.isArray(feedback.strengths)
      ? feedback.strengths
      : [];
    feedback.improvements = Array.isArray(feedback.improvements)
      ? feedback.improvements
      : [];
    feedback.conversationMoments = Array.isArray(feedback.conversationMoments)
      ? feedback.conversationMoments
      : [];

    feedback.callNumber = session.callNumber;

    if (!Array.isArray(session.voiceCallFeedback)) {
      session.voiceCallFeedback = [];
    }

    const existingIndex = session.voiceCallFeedback.findIndex(
      (entry) => entry.callNumber === session.callNumber,
    );

    if (existingIndex >= 0) {
      session.voiceCallFeedback[existingIndex] = feedback;
    } else {
      session.voiceCallFeedback.push(feedback);
    }

    session.markModified("voiceCallFeedback");
    await session.save();

    console.log("VOICE FEEDBACK RESULT:", feedback);

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Voice feedback generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate voice feedback" },
      { status: 500 },
    );
  }
}
