"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ArrowDown, ArrowUp, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { getDb } from "@/lib/firebase/client";
import { useToast } from "@/components/admin/Toast";
import { Button, Panel, SectionHead, Field, fieldClass, EmptyState, RiseCard, Skeleton } from "@/components/admin/ui";
import { MarkStats } from "@/components/admin/AdminIcons";
import { defaultProcess, cleanProcess, type ProcessStep } from "@/lib/useSiteContent";

export default function ProcessManager() {
  const toast = useToast();
  const [items, setItems] = useState<ProcessStep[]>(defaultProcess);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const snap = await getDoc(doc(getDb(), "settings", "process"));
        const raw = cleanProcess((snap.data()?.items ?? []) as ProcessStep[]);
        if (live && raw.length) setItems(raw);
      } catch (e) { console.error(e); }
      finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, []);

  function update(index: number, patch: Partial<ProcessStep>) {
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
    setItems((cur) => [...cur, { number: String(cur.length + 1).padStart(2, "0"), title: "New step", body: "" }]);
  }

  async function save() {
    setSaving(true);
    try {
      const clean = cleanProcess(items).map((s, i) => ({ ...s, number: String(i + 1).padStart(2, "0") }));
      await setDoc(doc(getDb(), "settings", "process"), { items: clean, updatedAt: serverTimestamp() }, { merge: true });
      setItems(clean);
      toast.success("Process saved", "The homepage and Process page now use these steps.");
    } catch (e) {
      console.error(e);
      toast.error("Could not save process", "Check Firebase permissions.");
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-8">
      <SectionHead
        mark={<MarkStats size={48} />}
        eyebrow="Content · Process"
        title="Studio process"
        desc="Edit the numbered method steps shown on the homepage and the Process page. Reorder, rename or rewrite each step."
        actions={
          <>
            <Button variant="quiet" icon={RotateCcw} onClick={() => { setItems(defaultProcess); toast.info("Original steps restored locally", "Save to publish."); }}>Restore</Button>
            <Button icon={Plus} variant="ghost" onClick={add}>Add step</Button>
            <Button icon={Save} loading={saving} onClick={save}>Save process</Button>
          </>
        }
      />

      {loading ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-52 w-full" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No steps yet" desc="Add the phases of your delivery method." action={<Button icon={Plus} onClick={add}>Add step</Button>} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {items.map((s, index) => (
            <RiseCard key={index} delay={index * 0.04}>
              <Panel className="p-5 md:p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <span className="font-mono text-2xl text-gold">{String(index + 1).padStart(2, "0")}</span>
                  <div className="flex items-center gap-1">
                    <button aria-label="Move up" onClick={() => move(index, -1)} disabled={index === 0} className="grid h-8 w-8 place-items-center border border-onyx/10 transition-colors hover:border-gold disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button aria-label="Move down" onClick={() => move(index, 1)} disabled={index === items.length - 1} className="grid h-8 w-8 place-items-center border border-onyx/10 transition-colors hover:border-gold disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <button aria-label="Remove step" onClick={() => remove(index)} className="grid h-8 w-8 place-items-center border border-onyx/10 text-danger transition-colors hover:border-danger"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="grid gap-4">
                  <Field label="Title"><input className={fieldClass()} value={s.title} onChange={(e) => update(index, { title: e.target.value })} /></Field>
                  <Field label="Description"><textarea className={`${fieldClass()} min-h-28`} value={s.body} onChange={(e) => update(index, { body: e.target.value })} /></Field>
                </div>
              </Panel>
            </RiseCard>
          ))}
        </div>
      )}
    </div>
  );
}
