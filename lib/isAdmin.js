import { timingSafeEqual } from "node:crypto";

// Admin-only routes need the `x-admin-secret` header to match ADMIN_SECRET.
// If ADMIN_SECRET is not set, nobody is allowed.
export function isAdmin(req) {
  const secret = process.env.ADMIN_SECRET;
  const given = req.headers.get("x-admin-secret");
  if (!secret || !given) return false;

  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}
