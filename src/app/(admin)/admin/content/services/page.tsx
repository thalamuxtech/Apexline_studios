"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  ArrowDown, ArrowUp, Plus, RotateCcw, Save, Trash2, X,
  Compass, HardHat, Sofa, Trees, Hammer, FileText,
  Building2, Ruler, Lightbulb, PenTool, Layers, Landmark, type LucideIcon,
} from "lucide-react";
import { getDb } from "@/lib/firebase/client";
import { useToast } from "@/components/admin/Toast";
import { Button, Panel, SectionHead, Field, fieldClass, EmptyState, RiseCard, Skeleton } from "@/components/admin/ui";
import { MarkServices } from "@/components/admin/AdminIcons";
import {
  defaultServices, cleanServices, slugify, SERVICE_ICONS, type ServiceItem,
} from "@/lib/useSiteContent";

const ICONS: Record<string, LucideIcon> = {
  Compass, HardHat, Sofa, Trees, Hammer, FileText,
  Building2, Ruler, Lightbulb, PenTool, Layers, Landmark,
};

export default function ServicesManager() {
  const toast = useToast();
  const [items, setItems] = useState<ServiceItem[]>(defaultServices);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const snap = await getDoc(doc(getDb(), "settings", "services"));
        const raw = cleanServices((snap.data()?.items ?? []) as ServiceItem[]);
        if (live && raw.length) setItems(raw);
      } catch (e) { console.error(e); }
      finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, []);

  function update(index: number, patch: Partial<ServiceItem>) {
    setItems((cur) => cur.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }
  function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    setItems((cur) => { const next = [...cur]; [next[index], next[j]] = [next[j], next[index]]; return next; });
  }
  function remove(index: number) {
    setItems((cur) => cur.filter((_, i) => i !== index));
  }
  function add() {
    setItems((cur) => [...cur, { slug: `service-${cur.length + 1}`, title: "New service", summary: "", icon: "Compass", deliverables: [] }]);
  }

  async function save() {
    setSaving(true);
    try {
      const clean = cleanServices(items).map((s) => ({ ...s, slug: s.slug || slugify(s.title) }));
      await setDoc(doc(getDb(), "settings", "services"), { items: clean, updatedAt: serverTimestamp() }, { merge: true });
      setItems(clean);
      toast.success("Services saved", "The public services grid and footer now use these.");
    } catch (e) {
      console.error(e);
      toast.error("Could not save services", "Check Firebase permissions.");
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-8">
      <SectionHead
        mark={<MarkServices size={48} />}
        eyebrow="Content · Services"
        title="Studio services"
        desc="Edit the six disciplines shown on the homepage, services page and footer. Reorder, rename, change the icon or the summary."
        actions={
          <>
            <Button variant="quiet" icon={RotateCcw} onClick={() => { setItems(defaultServices); toast.info("Original services restored locally", "Save to publish."); }}>Restore</Button>
            <Button icon={Plus} variant="ghost" onClick={add}>Add service</Button>
            <Button icon={Save} loading={saving} onClick={save}>Save services</Button>
          </>
        }
      />

      {loading ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No services yet" desc="Add the disciplines your studio offers." action={<Button icon={Plus} onClick={add}>Add service</Button>} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {items.map((s, index) => {
            const Icon = ICONS[s.icon] ?? Compass;
            return (
              <RiseCard key={index} delay={index * 0.04}>
                <Panel className="p-5 md:p-6">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center border border-gold/30 bg-gold/10"><Icon className="h-5 w-5 text-gold" strokeWidth={1.4} /></span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">#{index + 1}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button aria-label="Move up" onClick={() => move(index, -1)} disabled={index === 0} className="grid h-8 w-8 place-items-center border border-onyx/10 transition-colors hover:border-gold disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                      <button aria-label="Move down" onClick={() => move(index, 1)} disabled={index === items.length - 1} className="grid h-8 w-8 place-items-center border border-onyx/10 transition-colors hover:border-gold disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                      <button aria-label="Remove service" onClick={() => remove(index)} className="grid h-8 w-8 place-items-center border border-onyx/10 text-danger transition-colors hover:border-danger"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <Field label="Title"><input className={fieldClass()} value={s.title} onChange={(e) => update(index, { title: e.target.value })} /></Field>
                    <Field label="Summary"><textarea className={`${fieldClass()} min-h-24`} value={s.summary} onChange={(e) => update(index, { summary: e.target.value })} /></Field>
                    <Field label="Icon">
                      <div className="flex flex-wrap gap-2">
                        {SERVICE_ICONS.map((name) => {
                          const I = ICONS[name] ?? Compass;
                          const active = s.icon === name;
                          return (
                            <button
                              key={name}
                              type="button"
                              aria-label={name}
                              onClick={() => update(index, { icon: name })}
                              className={`grid h-10 w-10 place-items-center border transition-colors ${active ? "border-gold bg-gold/15 text-gold" : "border-onyx/10 text-onyx/60 hover:border-gold/60"}`}
                            >
                              <I className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          );
                        })}
                      </div>
                    </Field>
                    <DeliverablesEditor value={s.deliverables} onChange={(d) => update(index, { deliverables: d })} />
                  </div>
                </Panel>
              </RiseCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DeliverablesEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [entry, setEntry] = useState("");
  return (
    <Field label="Deliverables" hint="Press Enter or Add to append. These appear on the service detail page.">
      <div className="flex flex-wrap gap-2">
        {value.map((d, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 border border-onyx/10 bg-ivory/50 px-2.5 py-1.5 text-xs">
            {d}
            <button aria-label={`Remove ${d}`} onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-stone hover:text-danger"><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          className={fieldClass()}
          value={entry}
          placeholder="Add a deliverable"
          onChange={(e) => setEntry(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); if (entry.trim()) { onChange([...value, entry.trim()]); setEntry(""); } }
          }}
        />
        <Button type="button" variant="quiet" icon={Plus} onClick={() => { if (entry.trim()) { onChange([...value, entry.trim()]); setEntry(""); } }}>Add</Button>
      </div>
    </Field>
  );
}
