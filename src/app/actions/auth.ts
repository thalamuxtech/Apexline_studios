"use server";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/admin/auth";

export async function signInAction(idToken: string) {
  try {
    await createSession(idToken);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Sign-in failed" };
  }
}

export async function signOutAction() {
  await destroySession();
  redirect("/admin/login");
}
