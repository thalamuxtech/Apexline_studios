"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ArrowUpRight, Inbox, Briefcase, Users, FolderKanban, Loader2 } from "lucide-react";
import { getDb } from "@/lib/firebase/client";
import { formatDate } from "@/lib/utils";

type Lead = { id: string; formType: string; status: string; createdAt?: any; data?: Record<string, any> };

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(getDb(), "leads"), orderBy("createdAt", "desc"), limit(200)));
        setLeads(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const counts = {
    total: leads.length,
    newCount: leads.filter((l) => l.status === "new").length,
    quote: leads.filter((l) => l.formType === "quote").length,
    careers: leads.filter((l) => l.formType === "careers").length,
    trainee: leads.filter((l) => l.formType === "trainee").length,
  };
  const recent = leads.slice(0, 6);

  const cards = [
    { label: "Inbox (new)", value: counts.newCount, icon: Inbox, href: "/admin/leads?status=new" },
    { label: "Quote requests", value: counts.quote, icon: FolderKanban, href: "/admin/leads?formType=quote" },
    { label: "Career applications", value: counts.careers, icon: Briefcase, href: "/admin/leads?formType=careers" },
    { label: "Trainee applications", value: counts.trainee, icon: Users, href: "/admin/leads?formType=trainee" },
  ];

  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow text-gold mb-3">Overview</p>
        <h1 className="font-display text-4xl md:text-5xl">Studio dashboard</h1>
        <p className="mt-3 text-stone">A real-time view of inbound enquiries and applications across every studio form.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="group border border-onyx/10 bg-white p-6 md:p-7 hover:border-gold transition-colors">
            <div className="flex items-start justify-between">
              <c.icon className="h-6 w-6 text-gold" strokeWidth={1.25} />
              <ArrowUpRight className="h-4 w-4 text-onyx/40 group-hover:text-gold transition-colors" />
            </div>
            <p className="mt-8 font-display text-5xl">{loading ? "—" : c.value}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone">{c.label}</p>
          </Link>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl">Recent submissions</h2>
          <Link href="/admin/leads" className="text-xs uppercase tracking-[0.2em] text-onyx/70 link-underline">View all</Link>
        </div>
        <div className="border border-onyx/10 bg-white overflow-hidden">
          {loading && <div className="p-6 flex items-center gap-3 text-sm text-stone"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>}
          {!loading && recent.length === 0 && <p className="p-6 text-sm text-stone">No submissions yet. Once the public forms receive enquiries, they&rsquo;ll appear here.</p>}
          <ul className="divide-y divide-onyx/10">
            {recent.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/leads/detail?id=${r.id}`} className="flex items-center gap-4 p-4 md:p-5 hover:bg-ivory/50">
                  <span className="hidden sm:inline-block shrink-0 w-20 text-[10px] uppercase tracking-[0.2em] text-gold">{r.formType}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{r.data?.fullName ?? r.data?.name ?? r.data?.email ?? "—"}</p>
                    <p className="text-xs text-stone truncate">{r.data?.email} · {r.data?.subject ?? r.data?.serviceType ?? r.data?.role ?? r.data?.interest ?? ""}</p>
                  </div>
                  <span className="hidden md:inline text-xs text-stone">{r.createdAt?.toDate ? formatDate(r.createdAt.toDate()) : ""}</span>
                  <span className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 ${r.status === "new" ? "bg-gold/20 text-gold-deep" : "bg-onyx/5 text-stone"}`}>{r.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
