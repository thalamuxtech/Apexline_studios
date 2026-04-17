"use server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { contactSchema, quoteSchema, careersSchema, traineeSchema, newsletterSchema, type LeadFormType } from "@/lib/schemas";
import { headers } from "next/headers";

type ActionResult = { ok: true; id: string } | { ok: false; error: string };

const schemaMap = {
  contact: contactSchema,
  quote: quoteSchema,
  careers: careersSchema,
  trainee: traineeSchema,
  newsletter: newsletterSchema,
} as const;

export async function submitLead(formType: LeadFormType, payload: unknown): Promise<ActionResult> {
  const schema = schemaMap[formType];
  if (!schema) return { ok: false, error: "Unknown form" };
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const h = await headers();
    const ua = h.get("user-agent") ?? "";
    const ip = h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "";
    const referer = h.get("referer") ?? "";

    const doc = await adminDb.collection("leads").add({
      formType,
      data: parsed.data,
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
      source: { ua, ip, referer },
    });

    return { ok: true, id: doc.id };
  } catch (e) {
    console.error("submitLead error", e);
    return { ok: false, error: "Unable to submit right now. Please try again." };
  }
}
