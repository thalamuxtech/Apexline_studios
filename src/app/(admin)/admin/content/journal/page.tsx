"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ArrowDown, ArrowUp, Eye, Plus, RotateCcw, Save, Trash2, UploadCloud } from "lucide-react";
import { getDb, getStorageClient } from "@/lib/firebase/client";
import { useToast } from "@/components/admin/Toast";
import { Button, Panel, SectionHead, Field, fieldClass, EmptyState, RiseCard, Skeleton, Badge } from "@/components/admin/ui";
import { MarkTestimonials } from "@/components/admin/AdminIcons";
import { defaultJournal, cleanJournal, slugify, type JournalArticle } from "@/lib/useSiteContent";

export default function JournalManager() {
  const toast = useToast();
  const [items, setItems] = useState<JournalArticle[]>(defaultJournal);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const snap = await getDoc(doc(getDb(), "settings", "journal"));
        const raw = cleanJournal((snap.data()?.items ?? []) as JournalArticle[]);
        if (live && raw.length) setItems(raw);
      } catch (e) { console.error(e); }
      finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, []);

  function update(index: number, patch: Partial<JournalArticle>) {
    setItems((cur) => cur.map((a, i) => (i === index ? { ...a, ...patch } : a)));
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
    setItems((cur) => [{ slug: "", title: "New entry", excerpt: "", image: "", date: `${new Date().getFullYear()} · Editorial`, body: "", status: "draft" }, ...cur]);
  }

  async function uploadImage(index: number, file: File | undefined) {
    if (!file) return;
    setUploading(index);
    const pending = toast.push({ kind: "loading", title: "Uploading image…", sticky: true });
    try {
      const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
      const objectRef = ref(getStorageClient(), `public/journal/${Date.now()}-${safe}`);
      await uploadBytes(objectRef, file, { contentType: file.type });
      update(index, { image: await getDownloadURL(objectRef) });
      toast.dismiss(pending);
      toast.success("Image uploaded", "Save to publish.");
    } catch (e) {
      console.error(e);
      toast.dismiss(pending);
      toast.error("Upload failed", "Check Firebase Storage admin access.");
    } finally {
      setUploading(null);
      if (inputs.current[index]) inputs.current[index]!.value = "";
    }
  }

  async function save() {
    setSaving(true);
    try {
      const clean = cleanJournal(items.map((a) => ({ ...a, slug: a.slug || slugify(a.title) })));
      await setDoc(doc(getDb(), "settings", "journal"), { items: clean, updatedAt: serverTimestamp() }, { merge: true });
      setItems(clean);
      toast.success("Journal saved", "The public Journal now uses these entries.");
    } catch (e) {
      console.error(e);
      toast.error("Could not save journal", "Check Firebase permissions.");
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-8">
      <SectionHead
        mark={<MarkTestimonials size={48} />}
        eyebrow="Content · Journal"
        title="Journal & articles"
        desc="Create, edit, reorder and delete journal entries. Each entry gets its own public page with an image, excerpt and full body."
        actions={
          <>
            <Button variant="quiet" icon={RotateCcw} onClick={() => { setItems(defaultJournal); toast.info("Original entries restored locally", "Save to publish."); }}>Restore</Button>
            <Button icon={Plus} variant="ghost" onClick={add}>Add entry</Button>
            <Button icon={Save} loading={saving} onClick={save}>Save journal</Button>
          </>
        }
      />

      {loading ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No entries yet" desc="Publish your first journal article." action={<Button icon={Plus} onClick={add}>Add entry</Button>} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {items.map((a, index) => (
            <RiseCard key={index} delay={index * 0.04}>
              <Panel className="p-5 md:p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">#{index + 1}</span>
                    {a.status === "draft" ? <Badge tone="muted">Draft</Badge> : <Badge tone="success">Published</Badge>}
                  </div>
                  <div className="flex items-center gap-1">
                    {a.slug && a.status !== "draft" && (
                      <a href={`/journal/${a.slug}`} target="_blank" aria-label="Preview" className="grid h-8 w-8 place-items-center border border-onyx/10 hover:border-gold"><Eye className="h-3.5 w-3.5" /></a>
                    )}
                    <button aria-label="Move up" onClick={() => move(index, -1)} disabled={index === 0} className="grid h-8 w-8 place-items-center border border-onyx/10 hover:border-gold disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button aria-label="Move down" onClick={() => move(index, 1)} disabled={index === items.length - 1} className="grid h-8 w-8 place-items-center border border-onyx/10 hover:border-gold disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <button aria-label="Remove entry" onClick={() => remove(index)} className="grid h-8 w-8 place-items-center border border-onyx/10 text-danger hover:border-danger"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>

                <div className="relative mb-4 aspect-[16/9] overflow-hidden bg-graphite">
                  {a.image && <Image src={a.image} alt="" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />}
                </div>
                <input ref={(el) => { inputs.current[index] = el; }} type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(index, e.target.files?.[0])} />
                <Button variant="quiet" icon={uploading === index ? undefined : UploadCloud} loading={uploading === index} onClick={() => inputs.current[index]?.click()} className="mb-4 w-full">Upload image</Button>

                <div className="grid gap-3">
                  <Field label="Title"><input className={fieldClass()} value={a.title} onChange={(e) => update(index, { title: e.target.value })} /></Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Date / label"><input className={fieldClass()} value={a.date} onChange={(e) => update(index, { date: e.target.value })} placeholder="2026 · Essay" /></Field>
                    <Field label="Status">
                      <select className={fieldClass()} value={a.status ?? "published"} onChange={(e) => update(index, { status: e.target.value as JournalArticle["status"] })}>
                        <option value="published">Published</option>
                        <option value="draft">Draft (hidden)</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Excerpt"><textarea className={`${fieldClass()} min-h-20`} value={a.excerpt} onChange={(e) => update(index, { excerpt: e.target.value })} /></Field>
                  <Field label="Body" hint="Separate paragraphs with a blank line."><textarea className={`${fieldClass()} min-h-40`} value={a.body ?? ""} onChange={(e) => update(index, { body: e.target.value })} /></Field>
                </div>
              </Panel>
            </RiseCard>
          ))}
        </div>
      )}
    </div>
  );
}
