"use client";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import {
  contactSchema, quoteSchema, careersSchema, traineeSchema, newsletterSchema,
  type LeadFormType,
} from "@/lib/schemas";

const schemaMap = {
  contact: contactSchema,
  quote: quoteSchema,
  careers: careersSchema,
  trainee: traineeSchema,
  newsletter: newsletterSchema,
} as const;

export type SubmitResult = { ok: true; id: string } | { ok: false; error: string };

export async function submitLead(formType: LeadFormType, payload: unknown): Promise<SubmitResult> {
  const schema = schemaMap[formType];
  if (!schema) return { ok: false, error: "Unknown form" };
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const ref = await addDoc(collection(getDb(), "leads"), {
      formType,
      data: parsed.data,
      status: "new",
      createdAt: serverTimestamp(),
      source: {
        ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
        referer: typeof document !== "undefined" ? document.referrer : "",
        page: typeof window !== "undefined" ? window.location.pathname : "",
      },
    });
    return { ok: true, id: ref.id };
  } catch (e: any) {
    console.error("submitLead error", e);
    return { ok: false, error: "Unable to submit right now. Please try again in a moment." };
  }
}
