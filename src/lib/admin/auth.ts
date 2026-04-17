import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

const SESSION_COOKIE = "apex_session";
const MAX_AGE = 60 * 60 * 24 * 5; // 5 days

function allowlist(): string[] {
  return (process.env.ADMIN_ALLOWLIST_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
}

export async function createSession(idToken: string) {
  const decoded = await adminAuth.verifyIdToken(idToken);
  const email = (decoded.email ?? "").toLowerCase();
  if (!email || !allowlist().includes(email)) {
    throw new Error("This email is not authorised for admin access.");
  }
  const expiresIn = MAX_AGE * 1000;
  const cookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
  (await cookies()).set(SESSION_COOKIE, cookie, {
    maxAge: MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
  return decoded;
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession() {
  const c = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!c) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(c, true);
    const email = (decoded.email ?? "").toLowerCase();
    if (!allowlist().includes(email)) return null;
    return { uid: decoded.uid, email };
  } catch {
    return null;
  }
}
