"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Quote, RotateCcw, Save, Trash2 } from "lucide-react";
import { getDb } from "@/lib/firebase/client";
import { useToast } from "@/components/admin/Toast";
import { Button, Panel, SectionHead, Field, fieldClass, Badge, EmptyState, RiseCard, Skeleton } from "@/components/admin/ui";
import { MarkTestimonials } from "@/components/admin/AdminIcons";
import { defaultTestimonials, cleanTestimonials, type TestimonialItem } from "@/lib/useSiteContent";

export default function TestimonialsManager() {
  const toast = useToast();
  const [items, setItems] = useState<TestimonialItem[]>(defaultTestimonials);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const snap = await getDoc(doc(getDb(), "settings", "testimonials"));
        const raw = cleanTestimonials((snap.data()?.items ?? []) as TestimonialItem[]);
        if (live && raw.length) setItems(raw);
      } catch (e) { console.error(e); }
      finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, []);

  function update(index: number, patch: Partial<TestimonialItem>) {
    setItems((cur) => cur.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  }
  function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    setItems((cur) => { const next = [...cur]; [next[index], next[j]] = [next[j], next[index]]; return next; });
  }
  function remove(index: number) { setItems((cur) => cur.filter((_, i) => i !== index)); }
  function add() { setItems((cur) => [...cur, { quote: "", author: "", role: "", approved: true }]); }

  async function save() {
    setSaving(true);
    try {
      const clean = cleanTestimonials(items);
      await setDoc(doc(getDb(), "settings", "testimonials"), { items: clean, updatedAt: serverTimestamp() }, { merge: true });
      setItems(clean);
      toast.success("Testimonials saved", "The homepage client voices carousel now uses these.");
    } catch (e) {
      console.error(e);
      toast.error("Could not save testimonials", "Check Firebase permissions.");
    } finally { setSaving(false); }
  }

  const visibleCount = items.filter((t) => t.approved !== false).length;

  return (
    <div className="space-y-8">
      <SectionHead
        mark={<MarkTestimonials size={48} />}
        eyebrow="Content · Testimonials"
        title="Client voices"
        desc="Manage the rotating testimonials on the homepage. Toggle visibility to hide a quote without deleting it."
        actions={
          <>
            <Button variant="quiet" icon={RotateCcw} onClick={() => { setItems(defaultTestimonials); toast.info("Original testimonials restored locally", "Save to publish."); }}>Restore</Button>
            <Button variant="ghost" icon={Plus} onClick={add}>Add testimonial</Button>
            <Button icon={Save} loading={saving} onClick={save}>Save</Button>
          </>
        }
      />

      {!loading && (
        <p className="text-sm text-stone">
          <span className="font-mono text-gold">{visibleCount}</span> of {items.length} visible on the public site.
        </p>
      )}

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-44 w-full" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState mark={<Quote className="h-9 w-9 text-gold" strokeWidth={1.25} />} title="No testimonials yet" desc="Add a client quote to build trust on the homepage." action={<Button icon={Plus} onClick={add}>Add testimonial</Button>} />
      ) : (
        <div className="space-y-4">
          {items.map((t, index) => {
            const hidden = t.approved === false;
            return (
              <RiseCard key={index} delay={index * 0.04}>
                <Panel className={`p-5 md:p-6 ${hidden ? "opacity-70" : ""}`}>
                  <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
                    <div className="space-y-4">
                      <Field label="Quote"><textarea className={`${fieldClass()} min-h-28 font-editorial text-lg italic`} value={t.quote} onChange={(e) => update(index, { quote: e.target.value })} /></Field>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Author"><input className={fieldClass()} value={t.author} onChange={(e) => update(index, { author: e.target.value })} /></Field>
                        <Field label="Role / Company"><input className={fieldClass()} value={t.role} onChange={(e) => update(index, { role: e.target.value })} /></Field>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 lg:border-l lg:border-onyx/10 lg:pl-5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">#{index + 1}</span>
                        <Badge tone={hidden ? "muted" : "success"}>{hidden ? "Hidden" : "Visible"}</Badge>
                      </div>
                      <Button
                        variant="quiet"
                        icon={hidden ? Eye : EyeOff}
                        onClick={() => update(index, { approved: hidden })}
                        className="w-full"
                      >
                        {hidden ? "Show" : "Hide"}
                      </Button>
                      <div className="mt-auto flex items-center gap-1">
                        <button aria-label="Move up" onClick={() => move(index, -1)} disabled={index === 0} className="grid h-9 flex-1 place-items-center border border-onyx/10 transition-colors hover:border-gold disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                        <button aria-label="Move down" onClick={() => move(index, 1)} disabled={index === items.length - 1} className="grid h-9 flex-1 place-items-center border border-onyx/10 transition-colors hover:border-gold disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                        <button aria-label="Remove testimonial" onClick={() => remove(index)} className="grid h-9 flex-1 place-items-center border border-onyx/10 text-danger transition-colors hover:border-danger"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
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
