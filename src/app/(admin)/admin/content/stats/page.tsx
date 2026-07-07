"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ArrowDown, ArrowUp, Plus, RotateCcw, Save, Trash2, X } from "lucide-react";
import { getDb } from "@/lib/firebase/client";
import { useToast } from "@/components/admin/Toast";
import { Button, Panel, SectionHead, Field, fieldClass, EmptyState, RiseCard, Skeleton } from "@/components/admin/ui";
import { MarkStats } from "@/components/admin/AdminIcons";
import {
  defaultStats, defaultClients, cleanStats, cleanClients, type StatItem,
} from "@/lib/useSiteContent";

export default function StatsClientsManager() {
  const toast = useToast();
  const [stats, setStats] = useState<StatItem[]>(defaultStats);
  const [clients, setClients] = useState<string[]>(defaultClients);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [statsSnap, clientsSnap] = await Promise.all([
          getDoc(doc(getDb(), "settings", "stats")),
          getDoc(doc(getDb(), "settings", "clients")),
        ]);
        if (!live) return;
        const s = cleanStats((statsSnap.data()?.items ?? []) as StatItem[]);
        const c = cleanClients((clientsSnap.data()?.items ?? []) as string[]);
        if (s.length) setStats(s);
        if (c.length) setClients(c);
      } catch (e) { console.error(e); }
      finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, []);

  function updateStat(index: number, patch: Partial<StatItem>) {
    setStats((cur) => cur.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }
  function moveStat(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= stats.length) return;
    setStats((cur) => { const next = [...cur]; [next[index], next[j]] = [next[j], next[index]]; return next; });
  }

  async function save() {
    setSaving(true);
    try {
      const cleanS = cleanStats(stats);
      const cleanC = cleanClients(clients);
      await Promise.all([
        setDoc(doc(getDb(), "settings", "stats"), { items: cleanS, updatedAt: serverTimestamp() }, { merge: true }),
        setDoc(doc(getDb(), "settings", "clients"), { items: cleanC, updatedAt: serverTimestamp() }, { merge: true }),
      ]);
      setStats(cleanS); setClients(cleanC);
      toast.success("Stats & clients saved", "The homepage counters and marquee now use these.");
    } catch (e) {
      console.error(e);
      toast.error("Could not save", "Check Firebase permissions.");
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-10">
      <SectionHead
        mark={<MarkStats size={48} />}
        eyebrow="Content · Metrics"
        title="Stats & client marquee"
        desc="Edit the animated counters on the homepage and the scrolling list of client names."
        actions={
          <>
            <Button variant="quiet" icon={RotateCcw} onClick={() => { setStats(defaultStats); setClients(defaultClients); toast.info("Originals restored locally", "Save to publish."); }}>Restore</Button>
            <Button icon={Save} loading={saving} onClick={save}>Save all</Button>
          </>
        }
      />

      {/* Stats */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl">Counters</h3>
          <Button variant="ghost" icon={Plus} onClick={() => setStats((c) => [...c, { value: "", label: "" }])}>Add stat</Button>
        </div>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s, index) => (
              <RiseCard key={index} delay={index * 0.05}>
                <Panel tone="dark" className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-bone/40">#{index + 1}</span>
                    <div className="flex items-center gap-1">
                      <button aria-label="Move left" onClick={() => moveStat(index, -1)} disabled={index === 0} className="grid h-7 w-7 place-items-center border border-white/10 text-bone/70 transition-colors hover:border-gold disabled:opacity-30"><ArrowUp className="h-3 w-3 -rotate-90" /></button>
                      <button aria-label="Move right" onClick={() => moveStat(index, 1)} disabled={index === stats.length - 1} className="grid h-7 w-7 place-items-center border border-white/10 text-bone/70 transition-colors hover:border-gold disabled:opacity-30"><ArrowDown className="h-3 w-3 -rotate-90" /></button>
                      <button aria-label="Remove stat" onClick={() => setStats((c) => c.filter((_, i) => i !== index))} className="grid h-7 w-7 place-items-center border border-white/10 text-danger transition-colors hover:border-danger"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                  <input className={`${fieldClass("dark")} font-display text-3xl`} value={s.value} placeholder="15+" onChange={(e) => updateStat(index, { value: e.target.value })} />
                  <input className={`${fieldClass("dark")} mt-2 text-xs uppercase tracking-[0.2em]`} value={s.label} placeholder="Years of practice" onChange={(e) => updateStat(index, { label: e.target.value })} />
                </Panel>
              </RiseCard>
            ))}
          </div>
        )}
        <p className="text-[11px] text-stone">Tip: the counter animates the number it finds — write values like <code className="text-gold">15+</code>, <code className="text-gold">150+</code> or <code className="text-gold">100%</code>.</p>
      </section>

      {/* Clients */}
      <section className="space-y-4">
        <h3 className="font-display text-2xl">Client marquee</h3>
        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <Panel className="p-5 md:p-6">
            <ClientEditor clients={clients} onChange={setClients} />
          </Panel>
        )}
      </section>
    </div>
  );
}

function ClientEditor({ clients, onChange }: { clients: string[]; onChange: (v: string[]) => void }) {
  const [entry, setEntry] = useState("");
  function add() {
    const v = entry.trim();
    if (v && !clients.includes(v)) onChange([...clients, v]);
    setEntry("");
  }
  if (clients.length === 0 && !entry) {
    return (
      <EmptyState title="No client names yet" desc="Add the names shown in the scrolling marquee." action={
        <div className="flex gap-2">
          <input className={fieldClass()} value={entry} placeholder="Client name" onChange={(e) => setEntry(e.target.value)} />
          <Button icon={Plus} onClick={add}>Add</Button>
        </div>
      } />
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {clients.map((c, i) => (
          <span key={c} className="inline-flex items-center gap-2 border border-onyx/10 bg-ivory/50 px-3 py-2 font-display italic text-lg text-onyx/80">
            {c}
            <button aria-label={`Remove ${c}`} onClick={() => onChange(clients.filter((_, j) => j !== i))} className="text-stone hover:text-danger"><X className="h-3.5 w-3.5" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className={fieldClass()}
          value={entry}
          placeholder="Add a client name"
          onChange={(e) => setEntry(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
        />
        <Button variant="quiet" icon={Plus} onClick={add}>Add client</Button>
      </div>
    </div>
  );
}
