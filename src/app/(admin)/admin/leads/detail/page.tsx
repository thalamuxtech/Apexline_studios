"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { arrayUnion, deleteDoc, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, Mail, Phone, Trash2, Loader2 } from "lucide-react";
import { getDb, getFirebaseAuth } from "@/lib/firebase/client";
import { formatDate } from "@/lib/utils";

const STATUSES = ["new", "contacted", "qualified", "won", "lost", "archived"] as const;
type Status = (typeof STATUSES)[number];
type Lead = { id: string; formType: string; status: Status; createdAt?: any; data?: any; notes?: any[] };

function LeadDetailInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const id = sp?.get("id") ?? "";

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setLoading(false); setNotFound(true); return; }
    (async () => {
      try {
        const snap = await getDoc(doc(getDb(), "leads", id));
        if (!snap.exists()) setNotFound(true);
        else setLead({ id: snap.id, ...(snap.data() as any) });
      } catch (e) { console.error(e); setNotFound(true); }
      setLoading(false);
    })();
  }, [id]);

  async function setStatus(s: Status) {
    if (!lead) return;
    setSaving(true);
    try {
      const ref = doc(getDb(), "leads", lead.id);
      await updateDoc(ref, { status: s, updatedAt: serverTimestamp(), updatedBy: getFirebaseAuth().currentUser?.email ?? "" });
      setLead({ ...lead, status: s });
    } catch (e) { console.error(e); }
    setSaving(false);
  }

  async function addNote() {
    if (!lead || !note.trim()) return;
    setSaving(true);
    try {
      const author = getFirebaseAuth().currentUser?.email ?? "";
      const entry = { author, note: note.trim(), at: new Date().toISOString() };
      const ref = doc(getDb(), "leads", lead.id);
      await updateDoc(ref, { notes: arrayUnion(entry), updatedAt: serverTimestamp() });
      setLead({ ...lead, notes: [...(lead.notes ?? []), entry] });
      setNote("");
    } catch (e) { console.error(e); }
    setSaving(false);
  }

  async function remove() {
    if (!lead) return;
    if (!confirm("Delete this submission permanently?")) return;
    setSaving(true);
    try {
      await deleteDoc(doc(getDb(), "leads", lead.id));
      router.replace("/admin/leads");
    } catch (e) { console.error(e); setSaving(false); }
  }

  if (loading) return <div className="flex items-center gap-3 text-sm text-stone"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>;
  if (notFound || !lead) return (
    <div className="space-y-4">
      <Link href="/admin/leads" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone hover:text-onyx">
        <ArrowLeft className="h-4 w-4" /> All submissions
      </Link>
      <h1 className="font-display text-3xl">Submission not found.</h1>
    </div>
  );

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

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-stone mr-2">Status</span>
        {STATUSES.map((s) => (
          <button
            key={s}
            disabled={saving}
            onClick={() => setStatus(s)}
            className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border transition-colors ${
              lead.status === s ? "bg-onyx text-bone border-onyx" : "bg-white text-onyx border-onyx/20 hover:border-onyx"
            }`}
          >{s}</button>
        ))}
      </div>

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
        <div className="p-6 border-t border-onyx/10 space-y-3">
          <textarea
            value={note} onChange={(e) => setNote(e.target.value)} rows={3}
            placeholder="Add an internal note..."
            className="w-full border border-onyx/15 bg-bone p-3 text-sm outline-none focus:border-gold resize-y"
          />
          <button onClick={addNote} disabled={saving || !note.trim()} className="btn-ghost-dark">
            {saving ? "Saving..." : "Add note"}
          </button>
        </div>
      </section>

      <div className="pt-4 border-t border-onyx/10">
        <button onClick={remove} disabled={saving} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-danger hover:underline">
          <Trash2 className="h-4 w-4" /> {saving ? "Deleting..." : "Delete submission"}
        </button>
      </div>
    </div>
  );
}

export default function LeadDetail() {
  return <Suspense fallback={<div className="text-sm text-stone">Loading…</div>}><LeadDetailInner /></Suspense>;
}
