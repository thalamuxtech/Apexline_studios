import Link from "next/link";
import { ArrowUpRight, Inbox, Briefcase, Users, FolderKanban } from "lucide-react";
import { adminDb } from "@/lib/firebase/admin";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const col = adminDb.collection("leads");
    const [total, newCount, quote, careers, trainee, recent] = await Promise.all([
      col.count().get(),
      col.where("status", "==", "new").count().get(),
      col.where("formType", "==", "quote").count().get(),
      col.where("formType", "==", "careers").count().get(),
      col.where("formType", "==", "trainee").count().get(),
      col.orderBy("createdAt", "desc").limit(6).get(),
    ]);
    return {
      total: total.data().count,
      newCount: newCount.data().count,
      quote: quote.data().count,
      careers: careers.data().count,
      trainee: trainee.data().count,
      recent: recent.docs.map((d) => ({ id: d.id, ...d.data() }) as any),
    };
  } catch {
    return { total: 0, newCount: 0, quote: 0, careers: 0, trainee: 0, recent: [] };
  }
}

export default async function AdminDashboard() {
  const s = await getStats();
  const cards = [
    { label: "Inbox (new)", value: s.newCount, icon: Inbox, href: "/admin/leads?status=new" },
    { label: "Quote requests", value: s.quote, icon: FolderKanban, href: "/admin/leads?formType=quote" },
    { label: "Career applications", value: s.careers, icon: Briefcase, href: "/admin/leads?formType=careers" },
    { label: "Trainee applications", value: s.trainee, icon: Users, href: "/admin/leads?formType=trainee" },
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
            <p className="mt-8 font-display text-5xl">{c.value}</p>
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
          {s.recent.length === 0 && <p className="p-6 text-sm text-stone">No submissions yet. Once the public forms receive enquiries, they&rsquo;ll appear here.</p>}
          <ul className="divide-y divide-onyx/10">
            {s.recent.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/leads/${r.id}`} className="flex items-center gap-4 p-4 md:p-5 hover:bg-ivory/50">
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
