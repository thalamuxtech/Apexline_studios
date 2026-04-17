"use client";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

export type AdminState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; user: User; isAdmin: true }
  | { status: "forbidden"; user: User };

export function listenAdmin(cb: (state: AdminState) => void): () => void {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, async (user) => {
    if (!user) { cb({ status: "unauthenticated" }); return; }
    try {
      const token = await user.getIdTokenResult(true);
      if (token.claims.admin === true) cb({ status: "authenticated", user, isAdmin: true });
      else cb({ status: "forbidden", user });
    } catch {
      cb({ status: "forbidden", user });
    }
  });
}

export async function signInAdmin(email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const auth = getFirebaseAuth();
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdTokenResult(true);
    if (token.claims.admin !== true) {
      await signOut(auth);
      return { ok: false, error: "This account does not have admin access." };
    }
    return { ok: true };
  } catch (e: any) {
    const raw = e?.code ?? e?.message ?? "Unable to sign in";
    return { ok: false, error: humanize(raw) };
  }
}

export async function signOutAdmin() {
  await signOut(getFirebaseAuth());
}

function humanize(code: string) {
  if (code.includes("wrong-password") || code.includes("invalid-credential")) return "Incorrect email or password.";
  if (code.includes("user-not-found")) return "No account exists for that email.";
  if (code.includes("too-many-requests")) return "Too many attempts. Please wait a minute and try again.";
  if (code.includes("network")) return "Network issue — please check your connection.";
  return "Unable to sign in. Please try again.";
}
