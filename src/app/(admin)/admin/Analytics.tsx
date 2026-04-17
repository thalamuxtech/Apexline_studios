"use client";
import { ArrowUpRight, BarChart3, LineChart, Users, Activity } from "lucide-react";
import { useMemo } from "react";

type Lead = { formType: string; createdAt?: any; status?: string };

const GA_MEASUREMENT_ID = "G-T005N3V1CV";
const GA_PROJECT_ID = "apexline-studios";

const GA_LINKS = [
  {
    label: "Realtime users",
    description: "Visitors on the site right now",
    icon: Activity,
    href: `https://analytics.google.com/analytics/web/#/p${GA_MEASUREMENT_ID}/reports/realtime`,
  },
  {
    label: "Audience overview",
    description: "Daily / weekly sessions, users and countries",
    icon: Users,
    href: `https://analytics.google.com/analytics/web/#/p${GA_MEASUREMENT_ID}/reports/reportinghub`,
  },
  {
    label: "Top pages",
    description: "Most-viewed pages and engagement by path",
    icon: BarChart3,
    href: `https://analytics.google.com/analytics/web/#/p${GA_MEASUREMENT_ID}/reports/explorer?params=_u..nav%3Dmaui%26_r.explorerCard..selmet%3D%5B%22activeUsers%22%5D`,
  },
  {
    label: "Acquisition",
    description: "Where traffic is coming from",
    icon: LineChart,
    href: `https://analytics.google.com/analytics/web/#/p${GA_MEASUREMENT_ID}/reports/acquisition`,
  },
];

export function AnalyticsPanel({ leads }: { leads: Lead[] }) {
  // Build a 14-day engagement series from Firestore leads.
  const series = useMemo(() => buildDailySeries(leads, 14), [leads]);
  const byType = useMemo(() => groupBy(leads, (l) => l.formType), [leads]);
  const totalThisWeek = useMemo(() => countSince(leads, 7), [leads]);
  const totalPrevWeek = useMemo(() => countBetween(leads, 14, 7), [leads]);
  const weekDelta = totalPrevWeek === 0 ? (totalThisWeek > 0 ? 100 : 0) : Math.round(((totalThisWeek - totalPrevWeek) / totalPrevWeek) * 100);

  const max = Math.max(1, ...series.map((d) => d.count));

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="eyebrow text-gold mb-2">Analytics</p>
          <h2 className="font-display text-3xl md:text-4xl">Site performance</h2>
        </div>
        <a
          href={`https://console.firebase.google.com/project/${GA_PROJECT_ID}/analytics`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone hover:text-onyx"
        >
          Open Google Analytics <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Google Analytics deep-link cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {GA_LINKS.map((g) => (
          <a
            key={g.label}
            href={g.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-onyx/10 bg-white p-5 md:p-6 hover:border-gold transition-colors"
          >
            <div className="flex items-start justify-between">
              <g.icon className="h-5 w-5 text-gold" strokeWidth={1.25} />
              <ArrowUpRight className="h-4 w-4 text-onyx/40 group-hover:text-gold transition-colors" />
            </div>
            <p className="mt-6 font-display text-lg leading-tight">{g.label}</p>
            <p className="mt-2 text-xs text-stone leading-relaxed">{g.description}</p>
          </a>
        ))}
      </div>

      {/* Local engagement strip */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 border border-onyx/10 bg-white p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="eyebrow mb-1">Lead engagement</p>
              <p className="font-display text-2xl">Last 14 days</p>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl leading-none">{totalThisWeek}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-stone">
                this week{" "}
                <span className={weekDelta >= 0 ? "text-success" : "text-danger"}>
                  {weekDelta >= 0 ? "+" : ""}{weekDelta}%
                </span>
              </p>
            </div>
          </div>
          {/* Bars */}
          <div className="flex items-end gap-1.5 h-32">
            {series.map((d) => (
              <div key={d.date} className="flex-1 group flex flex-col justify-end h-full" title={`${d.date} · ${d.count} leads`}>
                <div
                  className="bg-onyx/10 group-hover:bg-gold transition-colors"
                  style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? "4px" : "1px" }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-stone/60 mt-2">
            <span>{series[0]?.label}</span>
            <span>today</span>
          </div>
        </div>

        <div className="border border-onyx/10 bg-white p-6 md:p-8">
          <p className="eyebrow mb-4">By form type</p>
          {Object.keys(byType).length === 0 ? (
            <p className="text-sm text-stone">No submissions yet.</p>
          ) : (
            <ul className="space-y-3">
              {Object.entries(byType)
                .sort((a, b) => b[1] - a[1])
                .map(([k, v]) => {
                  const pct = Math.round((v / leads.length) * 100);
                  return (
                    <li key={k}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize">{k}</span>
                        <span className="font-mono text-stone">{v} · {pct}%</span>
                      </div>
                      <div className="mt-1 h-1 bg-onyx/5 overflow-hidden">
                        <div className="h-full bg-gold" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </div>

      <p className="text-xs text-stone">
        Tracking ID {GA_MEASUREMENT_ID}. Site visits, sessions and geography live in the Google Analytics console — open the cards above to drill in.
      </p>
    </section>
  );
}

function buildDailySeries(leads: Lead[], days: number) {
  const out: { date: string; label: string; count: number }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    out.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-NG", { day: "2-digit", month: "short" }),
      count: 0,
    });
  }
  const byDate = Object.fromEntries(out.map((x, i) => [x.date, i]));
  for (const l of leads) {
    const d = l.createdAt?.toDate ? l.createdAt.toDate() : null;
    if (!d) continue;
    const key = d.toISOString().slice(0, 10);
    if (byDate[key] !== undefined) out[byDate[key]].count++;
  }
  return out;
}

function groupBy<T>(arr: T[], key: (x: T) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const x of arr) {
    const k = key(x) || "unknown";
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

function countSince(leads: Lead[], days: number) {
  const cutoff = Date.now() - days * 86400000;
  return leads.filter((l) => {
    const d = l.createdAt?.toDate ? l.createdAt.toDate().getTime() : 0;
    return d >= cutoff;
  }).length;
}

function countBetween(leads: Lead[], from: number, to: number) {
  const now = Date.now();
  const lo = now - from * 86400000;
  const hi = now - to * 86400000;
  return leads.filter((l) => {
    const d = l.createdAt?.toDate ? l.createdAt.toDate().getTime() : 0;
    return d >= lo && d < hi;
  }).length;
}
