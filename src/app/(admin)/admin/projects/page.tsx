"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  ArrowDown, ArrowUp, Check, Eye, ImagePlus, Loader2, PanelTop, RotateCcw,
  Save, Search, Star, Trash2, UploadCloud,
} from "lucide-react";
import { getDb, getStorageClient } from "@/lib/firebase/client";
import { normalizeProject, projectFallbacks, type ManagedProject } from "@/lib/projects";
import { useManagedProjects } from "@/lib/useManagedProjects";
import { cleanHeroSlides, fallbackHeroSlides, type HeroSlide } from "@/lib/useHeroSlides";
import { useToast } from "@/components/admin/Toast";
import { Button, Panel, SectionHead, Field, fieldClass, Badge, Skeleton, EmptyState, RiseCard } from "@/components/admin/ui";
import { MarkProjects, MarkHero } from "@/components/admin/AdminIcons";

type SaveState = "idle" | "saving" | "saved";

export default function AdminProjectsPage() {
  const toast = useToast();
  const { projects, loading } = useManagedProjects(true);
  const [selectedSlug, setSelectedSlug] = useState(projectFallbacks[0]?.slug ?? "");
  const [draft, setDraft] = useState<ManagedProject | null>(null);
  const [queryText, setQueryText] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const selectedFallback = useMemo(
    () => projectFallbacks.find((p) => p.slug === selectedSlug) ?? projectFallbacks[0],
    [selectedSlug],
  );

  useEffect(() => {
    const project = projects.find((p) => p.slug === selectedSlug) ?? selectedFallback;
    if (project) setDraft(normalizeProject({ ...project, year: project.year }));
    setSaveState("idle");
  }, [projects, selectedSlug, selectedFallback]);

  const filtered = useMemo(() => {
    const term = queryText.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter((p) => [p.name, p.sector, p.location, p.client].join(" ").toLowerCase().includes(term));
  }, [projects, queryText]);

  function updateField<K extends keyof ManagedProject>(key: K, value: ManagedProject[K]) {
    setDraft((current) =>
      current ? normalizeProject({ ...current, [key]: value, year: key === "year" ? Number(value) : current.year }) : current,
    );
    setSaveState("idle");
  }

  function setGallery(nextGallery: string[]) {
    setDraft((current) => {
      if (!current) return current;
      const cover = nextGallery.includes(current.cover) ? current.cover : nextGallery[0] ?? current.cover;
      return normalizeProject({ ...current, gallery: nextGallery, cover, year: current.year });
    });
    setSaveState("idle");
  }

  async function saveProject() {
    if (!draft) return;
    setSaveState("saving");
    try {
      const clean = normalizeProject(draft);
      await setDoc(doc(getDb(), "projects", clean.slug), { ...clean, updatedAt: serverTimestamp() }, { merge: true });
      setDraft(clean);
      setSaveState("saved");
      toast.success("Project saved", "Public pages will use this version after refresh.");
    } catch (e) {
      console.error(e);
      setSaveState("idle");
      toast.error("Unable to save", "Check Firebase permissions and try again.");
    }
  }

  async function syncCurrentSite() {
    setSaveState("saving");
    try {
      await Promise.all(
        projectFallbacks.map((p) =>
          setDoc(doc(getDb(), "projects", p.slug), { ...p, status: "published", updatedAt: serverTimestamp() }, { merge: true }),
        ),
      );
      setSaveState("idle");
      toast.success("Site synced", "All current website projects are now editable in Firestore.");
    } catch (e) {
      console.error(e);
      setSaveState("idle");
      toast.error("Sync failed", "Could not sync the current project list.");
    }
  }

  async function restoreSelected() {
    if (!selectedFallback) return;
    const restored = normalizeProject({ ...selectedFallback, status: "published" });
    setDraft(restored);
    setSaveState("saving");
    try {
      await setDoc(doc(getDb(), "projects", restored.slug), { ...restored, updatedAt: serverTimestamp() }, { merge: true });
      setSaveState("saved");
      toast.success("Project restored", "This project now matches the original website content.");
    } catch (e) {
      console.error(e);
      setSaveState("idle");
      toast.error("Restore failed", "Try again after checking Firebase permissions.");
    }
  }

  async function uploadImages(files: FileList | null) {
    if (!draft || !files?.length) return;
    setUploading(true);
    const pending = toast.push({ kind: "loading", title: `Uploading ${files.length} image${files.length === 1 ? "" : "s"}…`, sticky: true });
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
        const objectRef = ref(getStorageClient(), `public/projects/${draft.slug}/${Date.now()}-${safe}`);
        await uploadBytes(objectRef, file, { contentType: file.type });
        urls.push(await getDownloadURL(objectRef));
      }
      setGallery([...draft.gallery, ...urls]);
      toast.dismiss(pending);
      toast.success(`${urls.length} image${urls.length === 1 ? "" : "s"} uploaded`, "Save the project to publish the gallery.");
    } catch (e) {
      console.error(e);
      toast.dismiss(pending);
      toast.error("Upload failed", "Confirm the signed-in account has admin storage access.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function removeImage(src: string) {
    if (!draft) return;
    setGallery(draft.gallery.filter((item) => item !== src));
  }

  function moveImage(index: number, direction: -1 | 1) {
    if (!draft) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= draft.gallery.length) return;
    const next = [...draft.gallery];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    setGallery(next);
  }

  return (
    <div className="space-y-10">
      <SectionHead
        mark={<MarkProjects size={48} />}
        eyebrow="Portfolio CMS"
        title="Projects & homepage slider"
        desc="Fix mismatched slider, portfolio and gallery images. Update the titles and metadata that appear across the public website."
        actions={
          <>
            <Button variant="quiet" icon={PanelTop} onClick={syncCurrentSite} loading={saveState === "saving"}>
              Sync current site
            </Button>
            <Button icon={Save} onClick={saveProject} loading={saveState === "saving"} disabled={!draft}>
              Save project
            </Button>
          </>
        }
      />

      <HeroSlidesManager />

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        {/* Project list */}
        <Panel className="h-fit">
          <div className="border-b border-onyx/10 p-4">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
              <input
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Search projects"
                className="w-full border border-onyx/10 bg-ivory/40 py-3 pl-10 pr-3 text-sm outline-none focus:border-gold"
              />
            </label>
          </div>
          <div className="max-h-[680px] space-y-1 overflow-y-auto p-2">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-3">
                  <Skeleton className="h-16 w-16 shrink-0" />
                  <div className="flex-1 space-y-2 py-1"><Skeleton className="h-3.5 w-32" /><Skeleton className="h-3 w-20" /></div>
                </div>
              ))}
            {!loading &&
              filtered.map((project) => (
                <button
                  key={project.slug}
                  onClick={() => setSelectedSlug(project.slug)}
                  className={`flex w-full gap-3 p-3 text-left transition-colors ${
                    selectedSlug === project.slug ? "bg-onyx text-bone" : "hover:bg-ivory"
                  }`}
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-graphite">
                    {project.cover && <Image src={project.cover} alt="" fill sizes="64px" className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{project.name}</p>
                    <p className={`mt-1 truncate text-xs ${selectedSlug === project.slug ? "text-bone/65" : "text-stone"}`}>{project.sector}</p>
                    <p className="mt-2 font-mono text-[10px] text-gold">{project.gallery.length} images</p>
                  </div>
                </button>
              ))}
          </div>
        </Panel>

        {draft && (
          <main className="space-y-6">
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <Panel className="p-5 md:p-7">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-stone">Editing</p>
                    <h2 className="mt-2 font-display text-3xl">{draft.name}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href={`/projects/${draft.slug}`} target="_blank" className="inline-flex items-center gap-2 border border-onyx/10 px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-onyx transition-colors hover:border-gold hover:text-gold">
                      <Eye className="h-4 w-4" /> Preview
                    </a>
                    <button onClick={restoreSelected} className="inline-flex items-center gap-2 border border-onyx/10 px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-onyx transition-colors hover:border-gold hover:text-gold">
                      <RotateCcw className="h-4 w-4" /> Restore
                    </button>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Project title"><input className={fieldClass()} value={draft.name} onChange={(e) => updateField("name", e.target.value)} /></Field>
                  <Field label="Sector"><input className={fieldClass()} value={draft.sector} onChange={(e) => updateField("sector", e.target.value)} /></Field>
                  <Field label="Year"><input className={fieldClass()} type="number" value={draft.year} onChange={(e) => updateField("year", Number(e.target.value))} /></Field>
                  <Field label="Location"><input className={fieldClass()} value={draft.location} onChange={(e) => updateField("location", e.target.value)} /></Field>
                  <Field label="Client"><input className={fieldClass()} value={draft.client} onChange={(e) => updateField("client", e.target.value)} /></Field>
                  <Field label="Status">
                    <select className={fieldClass()} value={draft.status ?? "published"} onChange={(e) => updateField("status", e.target.value as ManagedProject["status"])}>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </Field>
                  <Field label="Scope" className="md:col-span-2"><textarea className={`${fieldClass()} min-h-28`} value={draft.scope} onChange={(e) => updateField("scope", e.target.value)} /></Field>
                  <Field label="Brief" className="md:col-span-2"><textarea className={`${fieldClass()} min-h-40`} value={draft.brief} onChange={(e) => updateField("brief", e.target.value)} /></Field>
                </div>
              </Panel>

              {/* Cover preview */}
              <Panel tone="dark" className="p-5 md:p-6">
                <p className="eyebrow mb-4 text-gold">Current cover</p>
                <div className="relative aspect-[4/5] overflow-hidden bg-onyx">
                  {draft.cover && <Image src={draft.cover} alt={draft.name} fill sizes="360px" className="object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="font-mono text-xs text-gold">{draft.year}</p>
                    <h3 className="mt-1 font-display text-3xl leading-tight">{draft.name}</h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-bone/70">{draft.sector}</p>
                  </div>
                </div>
                {saveState === "saved" && (
                  <p className="mt-5 flex items-center gap-2 text-sm text-gold"><Check className="h-4 w-4" /> Saved</p>
                )}
              </Panel>
            </section>

            {/* Gallery */}
            <Panel className="p-5 md:p-7">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="eyebrow mb-2 text-gold">Gallery</p>
                  <h2 className="font-display text-3xl">Manage images</h2>
                  <p className="mt-2 text-sm text-stone">Upload replacements, choose the cover, reorder images or remove mismatched visuals.</p>
                </div>
                <div>
                  <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadImages(e.target.files)} />
                  <Button icon={UploadCloud} loading={uploading} onClick={() => fileInput.current?.click()}>Upload images</Button>
                </div>
              </div>

              {draft.gallery.length === 0 ? (
                <EmptyState
                  mark={<ImagePlus className="h-9 w-9 text-gold" strokeWidth={1.25} />}
                  title="Add the first image"
                  desc="JPG, PNG or WebP files upload to Firebase Storage."
                  action={<Button icon={UploadCloud} onClick={() => fileInput.current?.click()}>Upload images</Button>}
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {draft.gallery.map((src, index) => (
                    <RiseCard key={`${src}-${index}`} delay={index * 0.03}>
                      <div className="border border-onyx/10 bg-ivory/40">
                        <div className="relative aspect-[4/3] overflow-hidden bg-graphite">
                          <Image src={src} alt={`${draft.name} ${index + 1}`} fill sizes="(min-width:1280px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                          {draft.cover === src && (
                            <span className="absolute left-3 top-3"><Badge tone="gold"><Star className="h-3 w-3 fill-current" /> Cover</Badge></span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2 p-3">
                          <button onClick={() => updateField("cover", src)} className="text-[10px] uppercase tracking-[0.18em] text-onyx/70 transition-colors hover:text-gold">Set cover</button>
                          <div className="flex items-center gap-1">
                            <button aria-label="Move up" onClick={() => moveImage(index, -1)} className="grid h-8 w-8 place-items-center border border-onyx/10 transition-colors hover:border-gold disabled:opacity-30" disabled={index === 0}><ArrowUp className="h-3.5 w-3.5" /></button>
                            <button aria-label="Move down" onClick={() => moveImage(index, 1)} className="grid h-8 w-8 place-items-center border border-onyx/10 transition-colors hover:border-gold disabled:opacity-30" disabled={index === draft.gallery.length - 1}><ArrowDown className="h-3.5 w-3.5" /></button>
                            <button aria-label="Remove image" onClick={() => removeImage(src)} className="grid h-8 w-8 place-items-center border border-onyx/10 text-danger transition-colors hover:border-danger"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      </div>
                    </RiseCard>
                  ))}
                </div>
              )}
            </Panel>
          </main>
        )}
      </div>
    </div>
  );
}

function HeroSlidesManager() {
  const toast = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackHeroSlides);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const snap = await getDoc(doc(getDb(), "settings", "heroSlides"));
        const managed = cleanHeroSlides((snap.data()?.slides ?? []) as HeroSlide[]);
        if (live && managed.length) setSlides(managed);
      } catch (e) { console.error(e); }
    })();
    return () => { live = false; };
  }, []);

  function updateSlide(index: number, key: keyof HeroSlide, value: string) {
    setSlides((current) => current.map((slide, i) => (i === index ? { ...slide, [key]: value } : slide)));
  }

  async function uploadSlide(index: number, file: File | undefined) {
    if (!file) return;
    setUploading(index);
    const pending = toast.push({ kind: "loading", title: "Uploading hero image…", sticky: true });
    try {
      const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
      const objectRef = ref(getStorageClient(), `public/hero/${Date.now()}-${safe}`);
      await uploadBytes(objectRef, file, { contentType: file.type });
      updateSlide(index, "src", await getDownloadURL(objectRef));
      toast.dismiss(pending);
      toast.success("Hero image uploaded", "Save the slider to publish it.");
    } catch (e) {
      console.error(e);
      toast.dismiss(pending);
      toast.error("Hero upload failed", "Check Firebase Storage admin access.");
    } finally {
      setUploading(null);
      if (inputs.current[index]) inputs.current[index]!.value = "";
    }
  }

  async function saveSlides() {
    setSaving(true);
    try {
      const clean = cleanHeroSlides(slides);
      await setDoc(doc(getDb(), "settings", "heroSlides"), { slides: clean, updatedAt: serverTimestamp() }, { merge: true });
      setSlides(clean.length ? clean : fallbackHeroSlides);
      toast.success("Homepage slider saved");
    } catch (e) {
      console.error(e);
      toast.error("Could not save the homepage slider");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel tone="dark" className="p-5 md:p-7">
      <SectionHead
        tone="dark"
        mark={<MarkHero size={44} />}
        eyebrow="Homepage slider"
        title="Hero images & captions"
        desc="Replace mismatched slider visuals and edit the label shown in the first viewport."
        actions={
          <>
            <Button variant="quiet-dark" icon={RotateCcw} onClick={() => { setSlides(fallbackHeroSlides); toast.info("Original slider restored locally", "Save the slider to publish the restore."); }}>
              Restore
            </Button>
            <Button icon={Save} loading={saving} onClick={saveSlides}>Save slider</Button>
          </>
        }
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {slides.map((slide, index) => (
          <div key={index} className="border border-white/10 bg-onyx/35 p-4">
            <div className="relative aspect-[4/3] overflow-hidden bg-onyx">
              {slide.src && <Image src={slide.src} alt={slide.label} fill sizes="(min-width:1024px) 28vw, 100vw" className="object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-display text-2xl leading-tight text-bone">{slide.label}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gold">{slide.sector} / {slide.year}</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <input ref={(el) => { inputs.current[index] = el; }} type="file" accept="image/*" className="hidden" onChange={(e) => uploadSlide(index, e.target.files?.[0])} />
              <Button variant="ghost" icon={UploadCloud} loading={uploading === index} onClick={() => inputs.current[index]?.click()} className="w-full">
                Upload slide image
              </Button>
              <input className={fieldClass("dark")} value={slide.label} onChange={(e) => updateSlide(index, "label", e.target.value)} placeholder="Slide title" />
              <input className={fieldClass("dark")} value={slide.sector} onChange={(e) => updateSlide(index, "sector", e.target.value)} placeholder="Sector" />
              <input className={fieldClass("dark")} value={slide.year} onChange={(e) => updateSlide(index, "year", e.target.value)} placeholder="Year" />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
