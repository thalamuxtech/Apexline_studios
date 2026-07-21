"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ArrowDown, ArrowUp, Loader2, Plus, RotateCcw, Save, Trash2, UploadCloud } from "lucide-react";
import { getDb, getStorageClient } from "@/lib/firebase/client";
import { useToast } from "@/components/admin/Toast";
import { Button, Panel, SectionHead, Field, fieldClass, RiseCard } from "@/components/admin/ui";
import { MarkProfile } from "@/components/admin/AdminIcons";
import { defaultAbout, type AboutContent, type Milestone } from "@/lib/useSiteContent";

export default function AboutManager() {
  const toast = useToast();
  const [about, setAbout] = useState<AboutContent>(defaultAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const snap = await getDoc(doc(getDb(), "settings", "about"));
        const raw = snap.data()?.about as AboutContent | undefined;
        if (live && raw) setAbout({ ...defaultAbout, ...raw, milestones: raw.milestones ?? defaultAbout.milestones, principalBio: raw.principalBio ?? defaultAbout.principalBio });
      } catch (e) { console.error(e); }
      finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, []);

  function set<K extends keyof AboutContent>(key: K, value: AboutContent[K]) {
    setAbout((cur) => ({ ...cur, [key]: value }));
  }
  function setBio(index: number, value: string) {
    setAbout((cur) => ({ ...cur, principalBio: cur.principalBio.map((p, i) => (i === index ? value : p)) }));
  }
  function setMilestone(index: number, patch: Partial<Milestone>) {
    setAbout((cur) => ({ ...cur, milestones: cur.milestones.map((m, i) => (i === index ? { ...m, ...patch } : m)) }));
  }
  function moveMilestone(index: number, dir: -1 | 1) {
    const j = index + dir;
    setAbout((cur) => {
      if (j < 0 || j >= cur.milestones.length) return cur;
      const next = [...cur.milestones]; [next[index], next[j]] = [next[j], next[index]];
      return { ...cur, milestones: next };
    });
  }

  async function uploadImage(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    const pending = toast.push({ kind: "loading", title: "Uploading image…", sticky: true });
    try {
      const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
      const objectRef = ref(getStorageClient(), `public/about/${Date.now()}-${safe}`);
      await uploadBytes(objectRef, file, { contentType: file.type });
      set("imageSrc", await getDownloadURL(objectRef));
      toast.dismiss(pending);
      toast.success("Image uploaded", "Save to publish.");
    } catch (e) {
      console.error(e);
      toast.dismiss(pending);
      toast.error("Upload failed", "Check Firebase Storage admin access.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function save() {
    setSaving(true);
    try {
      const clean: AboutContent = {
        ...about,
        principalBio: about.principalBio.map((p) => p.trim()).filter(Boolean),
        milestones: about.milestones.map((m) => ({ year: m.year.trim(), title: m.title.trim(), body: m.body.trim() })).filter((m) => m.title),
      };
      await setDoc(doc(getDb(), "settings", "about"), { about: clean, updatedAt: serverTimestamp() }, { merge: true });
      setAbout(clean);
      toast.success("Studio page saved", "The public About page now uses this content.");
    } catch (e) {
      console.error(e);
      toast.error("Could not save", "Check Firebase permissions.");
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-8">
      <SectionHead
        mark={<MarkProfile size={48} />}
        eyebrow="Content · Studio"
        title="About / Studio page"
        desc="Edit the principal's profile, portrait, bio and the studio milestones timeline shown on the public About page."
        actions={
          <>
            <Button variant="quiet" icon={RotateCcw} onClick={() => { setAbout(defaultAbout); toast.info("Original content restored locally", "Save to publish."); }}>Restore</Button>
            <Button icon={Save} loading={saving} onClick={save}>Save studio page</Button>
          </>
        }
      />

      {loading ? (
        <div className="h-96 w-full animate-pulse bg-onyx/[0.06]" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Panel className="p-5 md:p-7 space-y-5">
            <Field label="Principal eyebrow"><input className={fieldClass()} value={about.principalEyebrow} onChange={(e) => set("principalEyebrow", e.target.value)} /></Field>
            <Field label="Principal name"><input className={fieldClass()} value={about.principalName} onChange={(e) => set("principalName", e.target.value)} /></Field>
            <Field label="Pull quote"><textarea className={`${fieldClass()} min-h-20`} value={about.principalQuote} onChange={(e) => set("principalQuote", e.target.value)} /></Field>
            {about.principalBio.map((para, i) => (
              <Field key={i} label={`Bio paragraph ${i + 1}`}>
                <div className="flex gap-2">
                  <textarea className={`${fieldClass()} min-h-24`} value={para} onChange={(e) => setBio(i, e.target.value)} />
                  <button aria-label="Remove paragraph" onClick={() => set("principalBio", about.principalBio.filter((_, j) => j !== i))} className="shrink-0 self-start border border-onyx/10 p-2 text-danger hover:border-danger"><Trash2 className="h-4 w-4" /></button>
                </div>
              </Field>
            ))}
            <Button variant="quiet" icon={Plus} onClick={() => set("principalBio", [...about.principalBio, ""])}>Add paragraph</Button>
          </Panel>

          <Panel tone="dark" className="p-5 md:p-6">
            <p className="eyebrow mb-4 text-gold">Portrait</p>
            <div className="relative aspect-[4/5] overflow-hidden bg-onyx">
              {about.imageSrc && <Image src={about.imageSrc} alt="" fill sizes="320px" className="object-cover" />}
            </div>
            <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0])} />
            <Button variant="ghost" icon={uploading ? undefined : UploadCloud} loading={uploading} onClick={() => fileInput.current?.click()} className="mt-4 w-full">Upload portrait</Button>
          </Panel>
        </div>
      )}

      {!loading && (
        <Panel className="p-5 md:p-7">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-2 text-gold">Milestones</p>
              <h2 className="font-display text-2xl md:text-3xl">Timeline</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Field label="Timeline heading" className="min-w-[220px]"><input className={fieldClass()} value={about.milestonesTitle} onChange={(e) => set("milestonesTitle", e.target.value)} /></Field>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {about.milestones.map((m, index) => (
              <div key={index} className="border border-onyx/10 bg-ivory/40 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-sm text-gold">#{index + 1}</span>
                  <div className="flex items-center gap-1">
                    <button aria-label="Move up" onClick={() => moveMilestone(index, -1)} disabled={index === 0} className="grid h-8 w-8 place-items-center border border-onyx/10 hover:border-gold disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button aria-label="Move down" onClick={() => moveMilestone(index, 1)} disabled={index === about.milestones.length - 1} className="grid h-8 w-8 place-items-center border border-onyx/10 hover:border-gold disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <button aria-label="Remove milestone" onClick={() => set("milestones", about.milestones.filter((_, j) => j !== index))} className="grid h-8 w-8 place-items-center border border-onyx/10 text-danger hover:border-danger"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="grid gap-3">
                  <input className={fieldClass()} value={m.year} onChange={(e) => setMilestone(index, { year: e.target.value })} placeholder="Year" />
                  <input className={fieldClass()} value={m.title} onChange={(e) => setMilestone(index, { title: e.target.value })} placeholder="Title" />
                  <textarea className={`${fieldClass()} min-h-20`} value={m.body} onChange={(e) => setMilestone(index, { body: e.target.value })} placeholder="Description" />
                </div>
              </div>
            ))}
          </div>
          <Button variant="quiet" icon={Plus} onClick={() => set("milestones", [...about.milestones, { year: "", title: "New milestone", body: "" }])} className="mt-4">Add milestone</Button>
        </Panel>
      )}
    </div>
  );
}
