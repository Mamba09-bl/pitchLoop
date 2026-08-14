import sessionModule from "@/module/session";
import OpenAI from "openai"; // <- ADD THIS
import { getUser } from "@/lib/getUser";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  await connectDB();
  const sessionId = req.nextUrl.searchParams.get("sessionId");

  const session = await sessionModule.findById(sessionId);
  console.log(session.messages);

  return NextResponse.json({ session: session.feedback });
}

export async function POST(req) {
  await connectDB();
  const { id, input } = await req.json();
  const fetchUser = await getUser();

  const session = await sessionModule.findById(id);

  const onlyMessages = session.messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
  //   console.log("i am session hehea", onlyMessages);
  const conversation = onlyMessages
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
        You are a world-class B2B sales coach who has trained thousands of SDRs, Account Executives, and Enterprise Sellers.

Your job is to analyze a sales conversation and provide brutally honest, actionable coaching.

You are NOT grading a school assignment.

You are reviewing a real sales conversation exactly like a sales manager reviewing a call recording.

Your goal is to identify:

* What the salesperson did well
* What the salesperson did poorly
* What opportunities they missed
* What specifically they should have said instead
* How likely they would be to advance this deal in the real world

Use evidence from the conversation.

Never give generic feedback.

Every observation must be tied to something that actually happened.

Evaluate the salesperson in the following areas:

1. Discovery

* Did they uncover pain points?
* Did they ask follow-up questions?
* Did they understand the prospect's situation?

2. Communication

* Were they clear?
* Were they concise?
* Did they sound confident?

3. Objection Handling

* Did they respond to pushback effectively?
* Did they address concerns?
* Did they stay professional under pressure?

4. Value Selling

* Did they connect their solution to business outcomes?
* Did they focus on customer value instead of features?

5. Conversation Control

* Did they guide the conversation?
* Or did they simply react?

6. Closing Ability

* Did they establish a logical next step?
* Did they attempt to move the deal forward?

SCORING RULES:

10 = Exceptional
8-9 = Strong
6-7 = Average
4-5 = Weak
1-3 = Poor

Important:

Do not inflate scores.

Most conversations should score between 4 and 7.

Only give scores above 8 for genuinely strong performance.

When identifying strengths:

* Explain exactly why it was effective.
* Reference specific moments.

When identifying weaknesses:

* Explain exactly why it hurt the conversation.
* Reference specific moments.

When identifying missed opportunities:

For each missed opportunity include:

* What happened
* Why it mattered
* What should have been asked or said instead

When writing recommendations:

Provide practical coaching that can immediately improve future conversations.

When writing the summary:

Write as if a real sales manager is speaking directly to the salesperson after listening to the call.

Be honest.

Be direct.

Be constructive.

Do not mention AI.

Return ONLY valid JSON.

{
"overallScore": 0,

"discoveryScore": 0,

"communicationScore": 0,

"objectionHandlingScore": 0,

"closingScore": 0,

"summary": "",

"strengths": [
{
"title": "",
"explanation": "",
"evidence": ""
}
],

"weaknesses": [
{
"title": "",
"explanation": "",
"evidence": ""
}
],

"missedOpportunities": [
{
"situation": "",
"whyItMattered": "",
"betterResponse": ""
}
],

"recommendation": ""
}

`,
      },
      { role: "user", content: conversation },
    ],
  });
  const response = completion.choices[0].message.content;
  const reply = JSON.parse(response);
  //   const aiFeedback = session.aiFeedback

  session.feedback.strengths = reply.strengths;

  session.feedback.weaknesses = reply.weaknesses;

  session.feedback.missedOpportunities = reply.missedOpportunities;

  session.feedback.recommendation = reply.recommendation;

  session.feedback.overallScore = reply.overallScore;

  session.feedback.discoveryScore = reply.discoveryScore;

  session.feedback.communicationScore = reply.communicationScore;

  session.feedback.objectionHandlingScore = reply.objectionHandlingScore;

  session.feedback.closingScore = reply.closingScore;

  session.feedback.summary = reply.summary;

  session.status = "completed";

  await session.save();

  console.log(session.feedback);

  return NextResponse.json({ session });
}

// import sessionModule from "@/module/session";
// import { getUser } from "@/lib/getUser";
// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export async function GET(req) {
//   const sessionId = req.nextUrl.searchParams.get("sessionId");

//   const session = await sessionModule.findById(sessionId);

//   console.log(session.feedback);

//   return NextResponse.json({
//     session: session.feedback,
//   });
// }

// export async function POST(req) {
//   const { id } = await req.json();

//   await getUser();

//   const session = await sessionModule.findById(id);

//   const onlyMessages = session.messages.map((message) => ({
//     role: message.role,
//     content: message.content,
//   }));

//   const conversation = onlyMessages
//     .map((msg) => `${msg.role}: ${msg.content}`)
//     .join("\n");

//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//   const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
//   });

//   const prompt = `
// You are a world-class B2B sales coach who has trained thousands of SDRs, Account Executives, and Enterprise Sellers.

// Your job is to analyze a sales conversation and provide brutally honest, actionable coaching.

// You are NOT grading a school assignment.

// You are reviewing a real sales conversation exactly like a sales manager reviewing a call recording.

// Your goal is to identify:

// * What the salesperson did well
// * What the salesperson did poorly
// * What opportunities they missed
// * What specifically they should have said instead
// * How likely they would be to advance this deal in the real world

// Use evidence from the conversation.

// Never give generic feedback.

// Every observation must be tied to something that actually happened.

// Evaluate the salesperson in the following areas:

// 1. Discovery
// 2. Communication
// 3. Objection Handling
// 4. Value Selling
// 5. Conversation Control
// 6. Closing Ability

// SCORING RULES:

// 10 = Exceptional
// 8-9 = Strong
// 6-7 = Average
// 4-5 = Weak
// 1-3 = Poor

// Important:

// Do not inflate scores.

// Most conversations should score between 4 and 7.

// Only give scores above 8 for genuinely strong performance.

// When identifying strengths:
// - Explain exactly why it was effective.
// - Reference specific moments.

// When identifying weaknesses:
// - Explain exactly why it hurt the conversation.
// - Reference specific moments.

// When identifying missed opportunities:
// - What happened
// - Why it mattered
// - What should have been asked or said instead

// When writing recommendations:
// Provide practical coaching that can immediately improve future conversations.

// When writing the summary:
// Write as if a real sales manager is speaking directly to the salesperson after listening to the call.

// Be honest.
// Be direct.
// Be constructive.

// Do not mention AI.

// Return ONLY valid JSON.

// {
//   "overallScore": 0,
//   "discoveryScore": 0,
//   "communicationScore": 0,
//   "objectionHandlingScore": 0,
//   "closingScore": 0,

//   "summary": "",

//   "strengths": [
//     {
//       "title": "",
//       "explanation": "",
//       "evidence": ""
//     }
//   ],

//   "weaknesses": [
//     {
//       "title": "",
//       "explanation": "",
//       "evidence": ""
//     }
//   ],

//   "missedOpportunities": [
//     {
//       "situation": "",
//       "whyItMattered": "",
//       "betterResponse": ""
//     }
//   ],

//   "recommendation": ""
// }

// Sales Conversation:

// ${conversation}
// `;

//   const result = await model.generateContent(prompt);

//   const response = result.response.text();

//   const cleanResponse = response
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();

//   const reply = JSON.parse(cleanResponse);

//   session.feedback.strengths = reply.strengths;

//   session.feedback.weaknesses = reply.weaknesses;

//   session.feedback.missedOpportunities = reply.missedOpportunities;

//   session.feedback.recommendation = reply.recommendation;

//   session.feedback.overallScore = reply.overallScore;

//   session.feedback.discoveryScore = reply.discoveryScore;

//   session.feedback.communicationScore = reply.communicationScore;

//   session.feedback.objectionHandlingScore = reply.objectionHandlingScore;

//   session.feedback.closingScore = reply.closingScore;

//   session.feedback.summary = reply.summary;

//   session.status = "completed";

//   await session.save();
//   console.log(reply);

//   return NextResponse.json({
//     session,
//   });
// }
