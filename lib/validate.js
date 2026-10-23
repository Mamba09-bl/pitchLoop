import * as z from "zod";
import { NextResponse } from "next/server";

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

// A MongoDB ID: exactly 24 hex characters
export const objectId = z.string().regex(OBJECT_ID_RE, "Invalid ID");

export function isValidId(id) {
  return typeof id === "string" && OBJECT_ID_RE.test(id);
}

// Checks input against a Zod schema.
// Returns { data } when valid, or { error, message } where error is a 400 response.
export function validate(schema, input) {
  const result = schema.safeParse(input);
  if (result.success) {
    return { data: result.data };
  }

  const message = result.error.issues[0]?.message || "Invalid request";
  return {
    message,
    error: NextResponse.json({ success: false, error: message }, { status: 400 }),
  };
}
