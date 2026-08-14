import sessionModule from "@/module/session";
import personaModule from "@/module/persona";
import userModule from "@/module/signup";

import OpenAI from "openai"; // <- ADD THIS

import { getUser } from "@/lib/getUser";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

const MAX_SESSIONS_PER_DAY = 2;

export async function GET() {
  await connectDB();
  const userAuth = await getUser();
  if (!userAuth || !userAuth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await userModule.findById(userAuth.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const now = new Date();
  const lastReset = new Date(user.checkSession.lastResetAt);
  const isSameDay =
    now.getFullYear() === lastReset.getFullYear() &&
    now.getMonth() === lastReset.getMonth() &&
    now.getDate() === lastReset.getDate();

  const count = isSameDay ? user.checkSession.count : 0;
  const limitReached = count >= MAX_SESSIONS_PER_DAY;

  return NextResponse.json({
    count,
    limit: MAX_SESSIONS_PER_DAY,
    remaining: Math.max(MAX_SESSIONS_PER_DAY - count, 0),
    limitReached,
  });
}

export async function POST(req) {
  try {
    return await handleStartSession(req);
  } catch (error) {
    console.error("start-session failed", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while starting the session. Please try again.",
      },
      { status: 500 },
    );
  }
}

async function handleStartSession(req) {
  await connectDB();
  const { id, sellingProduct, salesGoal, targetPain } = await req.json();
  const fetchUser = await getUser();
  console.log("i am value", sellingProduct);

  const trimmedSellingProduct = sellingProduct?.trim();
  const trimmedSalesGoal = salesGoal?.trim();
  const trimmedTargetPain = targetPain?.trim();
  const userAuth = await getUser();
  if (!userAuth || !userAuth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = userAuth.user.id;

  const user = await userModule.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.checkSession.count >= MAX_SESSIONS_PER_DAY) {
    const now = new Date();

    const lastReset = new Date(user.checkSession.lastResetAt);

    const isSameDay =
      now.getFullYear() === lastReset.getFullYear() &&
      now.getMonth() === lastReset.getMonth() &&
      now.getDate() === lastReset.getDate();

    if (!isSameDay) {
      user.checkSession.count = 0;
      user.checkSession.lastResetAt = now;
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Maximum sessions reached for today",
          reason:
            "You can only start 2 sessions per day. Your next session will be available in 24 hours.",
        },
        { status: 429 },
      );
    }
  }

  if (!trimmedSellingProduct || !trimmedSalesGoal) {
    return NextResponse.json(
      {
        success: false,
        valid: false,
        reason: "Please describe a clear product or service you want to sell.",
      },
      { status: 400 },
    );
  }

  const persona = await personaModule.findById(id);
  console.log("i am persona", persona);

  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const validationPrompt = `

You are validating the setup for a B2B sales roleplay.

The user wants to practice selling a product or service to a specific buyer persona.

Your job is to determine whether the scenario is realistic and useful for practicing a sales conversation with THIS specific buyer.

Return ONLY valid JSON:

{
  "valid": true,
  "productValid": true,
  "goalValid": true,
  "goalMatchesProduct": true,
  "productMatchesPersona": true,
  "reason": ""
}

==================================================
BUYER PERSONA
==================================================

Name:
${persona.name}

Job / Role:
${persona.job}

Company:
${persona.company}

Industry:
${persona.industry}

Description:
${persona.description}

Responsibilities / Goals:
${persona.goals}

Current Business Problems:
${persona.currentProblems}

==================================================
SELLER'S SALES CONTEXT
==================================================

Product or service:
${trimmedSellingProduct}

Call goal:
${trimmedSalesGoal}

==================================================
VALIDATION RULES
==================================================

1. PRODUCT VALIDITY

Set productValid to true when the product or service is meaningful, understandable, and something that could realistically be sold.

Reject:
- Gibberish
- Random characters
- Meaningless descriptions
- Inputs that do not describe a recognizable product or service

Be lenient about wording. The user does not need to provide a perfect product description.

2. GOAL VALIDITY

Set goalValid to true when the call goal describes a meaningful sales outcome.

Examples:
- Book a demo
- Schedule a follow-up meeting
- Get agreement for a trial
- Qualify the prospect
- Get agreement for a proof of concept
- Discuss pricing
- Close the sale

Reject gibberish, meaningless goals, or goals that are not reasonable sales objectives.

3. GOAL-PRODUCT MATCH

Set goalMatchesProduct to true when the requested sales goal reasonably makes sense for the product being sold.

Do not require the goal to mention the product explicitly.

4. PRODUCT-PERSONA MATCH

This is important.

Determine whether this product or service could reasonably be relevant to THIS buyer persona's:

- job
- business
- industry
- responsibilities
- goals
- business problems

The product does NOT need to directly belong to the buyer's industry.

For example, a dental clinic owner could reasonably be sold:
- appointment scheduling software
- WhatsApp automation
- CRM software
- accounting software
- payment systems
- marketing services
- cybersecurity services
- staff management software
- dental equipment
- business insurance

These products come from different industries but could still reasonably matter to a dental clinic.

However, reject a scenario when there is no reasonable business connection between the product and this buyer.

For example, highly specialized API observability software intended for engineering teams would normally not be relevant to a dental clinic owner unless the provided context establishes a reasonable connection.

Do not reject unusual but plausible B2B scenarios merely because they are uncommon.

5. FINAL VALIDITY

Set valid to true ONLY when ALL of these are true:

- productValid
- goalValid
- goalMatchesProduct
- productMatchesPersona

Otherwise set valid to false.

6. REASON

If valid is true:
Return an empty string for reason.

If invalid:
Give ONE short, user-friendly explanation describing the main problem.

Examples:

"This product does not appear relevant to a dental clinic owner's business or responsibilities."

"Please enter a clear sales goal, such as booking a demo or scheduling a follow-up."

"Please describe a recognizable product or service you want to sell."
`;

  const validationCompletion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content: validationPrompt,
      },
      {
        role: "user",
        content: `
Selling product/service:
${trimmedSellingProduct}

Sales goal:
${trimmedSalesGoal}
      `,
      },
    ],
  });

  let validationResult = {
    valid: false,
    productValid: false,
    goalValid: false,
    goalMatchesProduct: false,
    reason: "Please provide a clearer product and goal.",
  };

  try {
    const rawResponse = validationCompletion.choices[0].message.content;

    const cleanedResponse = rawResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsedValidation = JSON.parse(cleanedResponse);
    console.log(parsedValidation);

    validationResult = {
      valid: parsedValidation.valid === true,
      productValid: parsedValidation.productValid === true,
      goalValid: parsedValidation.goalValid === true,
      goalMatchesProduct: parsedValidation.goalMatchesProduct === true,
      reason:
        typeof parsedValidation.reason === "string"
          ? parsedValidation.reason
          : "Please provide a clearer product and goal.",
    };
  } catch (error) {
    console.error("Validation parse failed", error);
  }

  const isValidationValid =
    validationResult.valid &&
    validationResult.productValid &&
    validationResult.goalValid &&
    validationResult.goalMatchesProduct;

  if (!isValidationValid) {
    return NextResponse.json(
      {
        success: false,
        valid: false,
        reason: validationResult.reason,
      },
      { status: 400 },
    );
  }

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
          You are ${persona.name}.

  ${persona.systemPrompt}

  Personality:
  ${persona.personality}

  Difficulty:
  ${persona.difficulty}

  Conversation Rules:
  ${persona.conversationRules}

  Objections:
  ${persona.objections}

  You are starting a realistic B2B sales roleplay.

  You are the prospect, not the salesperson.

  Generate ONLY the first message of the conversation.

  The opening message should feel like a real business person who was interrupted by a sales call.

  Guidelines:

  - Stay completely in character.
  - Match the personality exactly.
  - Match the difficulty exactly.
  - Sound natural and human.
  - Do not sound scripted.
  - Do not sound like an AI assistant.
  - Do not greet in the same way every time.
  - Do not introduce yourself.
  - Keep it under 2 sentences.
  - Make the salesperson earn your attention.
  - If skeptical, question why they are contacting you.
  - If busy, sound rushed and impatient.
  - If hard difficulty, create friction immediately.
  - If friendly, be open but still realistic.
  - If the persona has objections, hint at them naturally.
  - Speak like a real executive, manager, or buyer.

  Good examples:

  Skeptical:
  "Before we go any further, what exactly are you hoping to accomplish with this conversation? I get a lot of pitches and most aren't worth the time."

  Busy:
  "I've only got a couple of minutes before my next meeting, so get to the point."

  Technical Buyer:
  "Alright, what's this regarding? If we're talking technology, I'll probably have a few questions."

  Friendly:
  "Sure, happy to chat. What did you want to discuss today?"

  Return ONLY the prospect's opening message.
  `,
      },
      {
        role: "user",
        content: "Start the conversation.",
      },
    ],
  });
  const reply = completion.choices[0].message.content;
  // increase call limit
  user.checkSession.count++;
  await user.save();

  const createSession = await sessionModule.create({
    userId: fetchUser.user.id,
    personaId: id,
    sellingProduct: trimmedSellingProduct,
    salesGoal: trimmedSalesGoal,
    targetPain: trimmedTargetPain,
    // session.currentStage = selectedSkills[0]
    messages: [
      {
        callNumber: 1,
        role: "assistant",
        content: reply,
      },
    ],
  });

  console.log("personashow", createSession);

  return NextResponse.json({ sessionId: createSession._id });
}
