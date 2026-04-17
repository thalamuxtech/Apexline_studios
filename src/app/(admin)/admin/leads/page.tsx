import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FORM_TYPES = [
  { value: "", label: "All types" },
  { value: "contact", label: "Contact" },
  { value: "quote", label: "Quote" },
  { value: "careers", label: "Careers" },
  { value: "trainee", label: "Trainee" },
  { value: "newsletter", label: "Newsletter" },
];
const STATUSES = [
  { value: "", label: "Any status" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "archived", label: "Archived" },
];

async function fetchLeads(formType?: string, status?: string) {
  try {
    let q: FirebaseFirestore.Query = adminDb.collection("leads");
    if (formType) q = q.where("formType", "==", formType);
    if (status) q = q.where("status", "==", status);
    q = q.orderBy("createdAt", "desc").limit(100);
    const snap = await q.get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as any);
  } catch {
    return [];
  }
}

export default async function LeadsIndex({ searchParams }: { searchParams: Promise<{ formType?: string; status?: string }> }) {
  const sp = await searchParams;
  const formType = sp.formType ?? "";
  const status = sp.status ?? "";
  const leads = await fetchLeads(formType || undefined, status || undefined);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="eyebrow text-gold mb-3">Inbox</p>
          <h1 className="font-display text-4xl md:text-5xl">Submissions</h1>
          <p className="mt-3 text-stone">All enquiries, applications and outreach from the public site.</p>
        </div>
      </header>

      <form className="flex flex-col sm:flex-row flex-wrap items-start sm:items-end gap-3" method="get">
        <div className="flex-1 min-w-[180px]">
          <label className="text-[11px] uppercase tracking-[0.22em] text-onyx/70">Form type</label>
          <select name="formType" defaultValue={formType} className="mt-1 w-full border border-onyx/15 bg-white px-3 py-2.5 text-sm">
            {FORM_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="text-[11px] uppercase tracking-[0.22em] text-onyx/70">Status</label>
          <select name="status" defaultValue={status} className="mt-1 w-full border border-onyx/15 bg-white px-3 py-2.5 text-sm">
            {STATUSES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <button type="submit" className="btn-ghost-dark h-[42px]">Filter</button>
        {(formType || status) && (
          <Link href="/admin/leads" className="text-xs uppercase tracking-[0.2em] text-stone hover:text-onyx pb-3">Clear</Link>
        )}
      </form>

      <div className="border border-onyx/10 bg-white overflow-x-auto">
        {leads.length === 0 ? (
          <p className="p-8 text-sm text-stone text-center">No submissions match this filter yet.</p>
        ) : (
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-ivory/60 text-xs uppercase tracking-[0.18em] text-stone">
              <tr>
                <th className="text-left px-5 py-4">Type</th>
                <th className="text-left px-5 py-4">Name</th>
                <th className="text-left px-5 py-4">Contact</th>
                <th className="text-left px-5 py-4 hidden md:table-cell">Context</th>
                <th className="text-left px-5 py-4">Status</th>
                <th className="text-left px-5 py-4 hidden sm:table-cell">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-onyx/10">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-ivory/40">
                  <td className="px-5 py-4">
                    <Link href={`/admin/leads/${l.id}`} className="text-[10px] uppercase tracking-[0.2em] text-gold">{l.formType}</Link>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/leads/${l.id}`} className="font-medium link-underline">
                      {l.data?.fullName ?? l.data?.name ?? l.data?.email ?? "—"}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-stone">
                    <div>{l.data?.email}</div>
                    {l.data?.phone && <div className="text-xs">{l.data.phone}</div>}
                  </td>
                  <td className="px-5 py-4 text-stone hidden md:table-cell">
                    {l.data?.subject ?? l.data?.serviceType ?? l.data?.role ?? l.data?.interest ?? l.data?.course ?? ""}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 ${l.status === "new" ? "bg-gold/20 text-gold-deep" : l.status === "won" ? "bg-success/15 text-success" : l.status === "lost" ? "bg-danger/10 text-danger" : "bg-onyx/5 text-stone"}`}>{l.status}</span>
                  </td>
                  <td className="px-5 py-4 text-stone text-xs hidden sm:table-cell">{l.createdAt?.toDate ? formatDate(l.createdAt.toDate()) : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
