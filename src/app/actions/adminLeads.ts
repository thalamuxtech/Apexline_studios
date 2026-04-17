"use server";
import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { getSession } from "@/lib/admin/auth";
import { FieldValue } from "firebase-admin/firestore";

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorised");
  return session;
}

export async function updateLeadStatus(id: string, status: "new" | "contacted" | "qualified" | "won" | "lost" | "archived") {
  const s = await requireAdmin();
  await adminDb.collection("leads").doc(id).update({
    status, updatedAt: FieldValue.serverTimestamp(), updatedBy: s.email,
  });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  return { ok: true };
}

export async function addLeadNote(id: string, note: string) {
  const s = await requireAdmin();
  if (!note.trim()) return { ok: false, error: "Note cannot be empty" };
  await adminDb.collection("leads").doc(id).update({
    notes: FieldValue.arrayUnion({ author: s.email, note, at: new Date().toISOString() }),
    updatedAt: FieldValue.serverTimestamp(),
  });
  revalidatePath(`/admin/leads/${id}`);
  return { ok: true };
}

export async function deleteLead(id: string) {
  await requireAdmin();
  await adminDb.collection("leads").doc(id).delete();
  revalidatePath("/admin/leads");
  return { ok: true };
}
