import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { adminDb } from "@/lib/firebase/admin";
import { formatDate } from "@/lib/utils";
import { StatusControls, NoteForm, DeleteControl } from "./Controls";

export const dynamic = "force-dynamic";

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snap = await adminDb.collection("leads").doc(id).get();
  if (!snap.exists) notFound();
  const lead = { id: snap.id, ...snap.data() } as any;

  return (
    <div className="space-y-8 max-w-5xl">
      <Link href="/admin/leads" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone hover:text-onyx">
        <ArrowLeft className="h-4 w-4" /> All submissions
      </Link>

      <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <p className="eyebrow text-gold mb-3">{lead.formType} submission</p>
          <h1 className="font-display text-4xl md:text-5xl break-words">{lead.data?.fullName ?? lead.data?.name ?? lead.data?.email ?? "Submission"}</h1>
          <p className="mt-2 text-sm text-stone">Received {lead.createdAt?.toDate ? formatDate(lead.createdAt.toDate()) : ""}</p>
        </div>
        <div className="flex flex-col gap-3 min-w-[220px]">
          {lead.data?.email && (
            <a href={`mailto:${lead.data.email}`} className="btn-ghost-dark justify-center">
              <Mail className="h-4 w-4" /> Reply by email
            </a>
          )}
          {lead.data?.phone && (
            <a href={`tel:${String(lead.data.phone).replace(/\s/g, "")}`} className="btn-ghost-dark justify-center">
              <Phone className="h-4 w-4" /> Call
            </a>
          )}
        </div>
      </header>

      <StatusControls id={lead.id} status={lead.status} />

      <section className="border border-onyx/10 bg-white">
        <h2 className="px-6 py-4 border-b border-onyx/10 font-display text-xl">Submission details</h2>
        <dl className="divide-y divide-onyx/10">
          {Object.entries(lead.data ?? {}).map(([k, v]) => (
            <div key={k} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-6 px-6 py-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-stone">{k}</dt>
              <dd className="text-sm text-onyx break-words whitespace-pre-wrap">{String(v)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border border-onyx/10 bg-white">
        <h2 className="px-6 py-4 border-b border-onyx/10 font-display text-xl">Internal notes</h2>
        <ul className="divide-y divide-onyx/10">
          {(lead.notes ?? []).length === 0 && <li className="px-6 py-6 text-sm text-stone">No notes yet.</li>}
          {(lead.notes ?? []).map((n: any, i: number) => (
            <li key={i} className="px-6 py-4">
              <p className="text-xs text-stone">{n.author} · {new Date(n.at).toLocaleString()}</p>
              <p className="mt-2 text-sm whitespace-pre-wrap">{n.note}</p>
            </li>
          ))}
        </ul>
        <div className="p-6 border-t border-onyx/10">
          <NoteForm id={lead.id} />
        </div>
      </section>

      <DeleteControl id={lead.id} />
    </div>
  );
}
