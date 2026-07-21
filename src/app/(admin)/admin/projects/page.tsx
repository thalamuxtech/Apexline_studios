"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  ArrowDown, ArrowUp, Check, Eye, ImagePlus, Loader2, PanelTop, Plus, RotateCcw,
  Save, Search, Star, Trash2, UploadCloud, X,
} from "lucide-react";
import { getDb, getStorageClient } from "@/lib/firebase/client";
import { blankProject, normalizeProject, projectFallbacks, slugify, type ManagedProject } from "@/lib/projects";
import { useManagedProjects } from "@/lib/useManagedProjects";
import { cleanHeroSlides, fallbackHeroSlides, type HeroSlide } from "@/lib/useHeroSlides";
import { useToast } from "@/components/admin/Toast";
import { Button, Panel, SectionHead, Field, fieldClass, Badge, Skeleton, EmptyState, RiseCard } from "@/components/admin/ui";
import { MarkProjects, MarkHero } from "@/components/admin/AdminIcons";

type SaveState = "idle" | "saving" | "saved";
const NEW_SENTINEL = "__new__";

export default function AdminProjectsPage() {
  const toast = useToast();
  const { projects, loading } = useManagedProjects(true);
  const [selectedSlug, setSelectedSlug] = useState(projectFallbacks[0]?.slug ?? "");
  const [draft, setDraft] = useState<ManagedProject | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [queryText, setQueryText] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const selectedFallback = useMemo(
    () => projectFallbacks.find((p) => p.slug === selectedSlug) ?? projectFallbacks[0],
    [selectedSlug],
  );

  useEffect(() => {
    if (isNew) return; // don't clobber a brand-new draft while it's being filled
    const project = projects.find((p) => p.slug === selectedSlug) ?? selectedFallback;
    if (project) setDraft(normalizeProject({ ...project, year: project.year }));
    setSaveState("idle");
  }, [projects, selectedSlug, selectedFallback, isNew]);

  const filtered = useMemo(() => {
    const term = queryText.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter((p) => [p.name, p.sector, p.location, p.client].join(" ").toLowerCase().includes(term));
  }, [projects, queryText]);

  const existingSlugs = useMemo(() => new Set(projects.map((p) => p.slug)), [projects]);

  function focusEditor() {
    // On small screens the editor is below the list — bring it into view.
    requestAnimationFrame(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function selectProject(slug: string) {
    setIsNew(false);
    setSelectedSlug(slug);
    focusEditor();
  }

  function startNewProject() {
    setIsNew(true);
    setSelectedSlug(NEW_SENTINEL);
    setDraft(blankProject());
    setSaveState("idle");
    focusEditor();
  }

  function updateField<K extends keyof ManagedProject>(key: K, value: ManagedProject[K]) {
    setDraft((current) =>
      current ? normalizeProject({ ...current, [key]: value, year: key === "year" ? Number(value) : current.year }) : current,
    );
    setSaveState("idle");
  }

  // Title drives an auto-suggested slug only while creating a new project.
  function updateName(value: string) {
    setDraft((current) => {
      if (!current) return current;
      const next = { ...current, name: value };
      if (isNew) next.slug = slugify(value);
      return normalizeProject({ ...next, year: current.year });
    });
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
    const slug = slugify(draft.slug || draft.name);
    if (!slug) {
      toast.error("Slug required", "Give the project a title or URL slug before saving.");
      return;
    }
    if (isNew && existingSlugs.has(slug)) {
      toast.error("Slug already in use", "Another project already uses this URL slug. Choose a different title/slug.");
      return;
    }
    setSaveState("saving");
    setBusy(true);
    try {
      const clean = normalizeProject({ ...draft, slug });
      await setDoc(doc(getDb(), "projects", clean.slug), { ...clean, updatedAt: serverTimestamp() }, { merge: true });
      setDraft(clean);
      setIsNew(false);
      setSelectedSlug(clean.slug);
      setSaveState("saved");
      toast.success(isNew ? "Project created" : "Project saved", "Public pages will use this version after refresh.");
    } catch (e) {
      console.error(e);
      setSaveState("idle");
      toast.error("Unable to save", "Check Firebase permissions and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteProject() {
    if (!draft) return;
    const isSeeded = projectFallbacks.some((p) => p.slug === draft.slug);
    const warning = isSeeded
      ? `Delete "${draft.name}"? It is a built-in project, so it will reappear from the site defaults on refresh. To hide it instead, set its status to Draft and save.`
      : `Delete "${draft.name}"? This permanently removes the project from the website. This cannot be undone.`;
    if (!window.confirm(warning)) return;
    setBusy(true);
    try {
      await deleteDoc(doc(getDb(), "projects", draft.slug));
      toast.success("Project deleted", isSeeded ? "Built-in default will show again until hidden as a draft." : "The project has been removed.");
      setIsNew(false);
      setSelectedSlug(projectFallbacks[0]?.slug ?? "");
    } catch (e) {
      console.error(e);
      toast.error("Delete failed", "Check Firebase permissions and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function syncCurrentSite() {
    setBusy(true);
    try {
      await Promise.all(
        projectFallbacks.map((p) =>
          setDoc(doc(getDb(), "projects", p.slug), { ...p, status: "published", updatedAt: serverTimestamp() }, { merge: true }),
        ),
      );
      toast.success("Site synced", "All current website projects are now editable in Firestore.");
    } catch (e) {
      console.error(e);
      toast.error("Sync failed", "Could not sync the current project list.");
    } finally {
      setBusy(false);
    }
  }

  async function restoreSelected() {
    if (!selectedFallback || isNew) return;
    const restored = normalizeProject({ ...selectedFallback, status: "published" });
    setDraft(restored);
    setBusy(true);
    try {
      await setDoc(doc(getDb(), "projects", restored.slug), { ...restored, updatedAt: serverTimestamp() }, { merge: true });
      setSaveState("saved");
      toast.success("Project restored", "This project now matches the original website content.");
    } catch (e) {
      console.error(e);
      toast.error("Restore failed", "Try again after checking Firebase permissions.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadImages(files: FileList | null) {
    if (!draft || !files?.length) return;
    const slug = slugify(draft.slug || draft.name) || "uploads";
    setUploading(true);
    const pending = toast.push({ kind: "loading", title: `Uploading ${files.length} image${files.length === 1 ? "" : "s"}…`, sticky: true });
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
        const objectRef = ref(getStorageClient(), `public/projects/${slug}/${Date.now()}-${safe}`);
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
    <div className="space-y-8 md:space-y-10">
      <SectionHead
        mark={<MarkProjects size={48} />}
        eyebrow="Portfolio CMS"
        title="Projects & homepage slider"
        desc="Create, edit, reorder and delete portfolio projects. Update every title, image and detail shown across the public website."
        actions={
          <>
            <Button variant="quiet" icon={PanelTop} onClick={syncCurrentSite} loading={busy && saveState !== "saving"}>
              Sync current site
            </Button>
            <Button icon={Save} onClick={saveProject} loading={saveState === "saving"} disabled={!draft}>
              {isNew ? "Create project" : "Save project"}
            </Button>
          </>
        }
      />

      <HeroSlidesManager />

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        {/* Project list */}
        <Panel className="h-fit">
          <div className="flex items-center gap-2 border-b border-onyx/10 p-4">
            <label className="relative block flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
              <input
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Search projects"
                className="w-full border border-onyx/10 bg-ivory/40 py-3 pl-10 pr-3 text-sm outline-none focus:border-gold"
              />
            </label>
            <Button icon={Plus} onClick={startNewProject} className="shrink-0 px-4">
              <span className="sr-only sm:not-sr-only">New</span>
            </Button>
          </div>
          {/* Horizontal scroll strip on mobile, vertical list on xl */}
          <div className="flex gap-2 overflow-x-auto p-2 xl:max-h-[680px] xl:flex-col xl:space-y-1 xl:overflow-x-visible xl:overflow-y-auto">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex w-56 gap-3 p-3 xl:w-auto">
                  <Skeleton className="h-16 w-16 shrink-0" />
                  <div className="flex-1 space-y-2 py-1"><Skeleton className="h-3.5 w-32" /><Skeleton className="h-3 w-20" /></div>
                </div>
              ))}
            {!loading &&
              filtered.map((project) => {
                const active = !isNew && selectedSlug === project.slug;
                return (
                  <button
                    key={project.slug}
                    onClick={() => selectProject(project.slug)}
                    className={`flex w-56 shrink-0 gap-3 p-3 text-left transition-colors xl:w-auto xl:shrink ${
                      active ? "bg-onyx text-bone" : "hover:bg-ivory"
                    }`}
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-graphite">
                      {project.cover && <Image src={project.cover} alt="" fill sizes="64px" className="object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{project.name}</p>
                      <p className={`mt-1 truncate text-xs ${active ? "text-bone/65" : "text-stone"}`}>{project.sector}</p>
                      <p className="mt-2 flex items-center gap-2 font-mono text-[10px] text-gold">
                        {project.gallery.length} images
                        {project.status === "draft" && <Badge tone="muted">Draft</Badge>}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>
        </Panel>

        {draft && (
          <main ref={editorRef} className="scroll-mt-24 space-y-6">
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              <Panel className="p-5 md:p-7">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-stone">{isNew ? "Creating" : "Editing"}</p>
                    <h2 className="mt-2 truncate font-display text-2xl md:text-3xl">{draft.name || "Untitled project"}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!isNew && (
                      <a href={`/projects/${draft.slug}`} target="_blank" className="inline-flex items-center gap-2 border border-onyx/10 px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-onyx transition-colors hover:border-gold hover:text-gold">
                        <Eye className="h-4 w-4" /> Preview
                      </a>
                    )}
                    {!isNew && (
                      <button onClick={restoreSelected} disabled={busy || !projectFallbacks.some((p) => p.slug === draft.slug)} className="inline-flex items-center gap-2 border border-onyx/10 px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-onyx transition-colors hover:border-gold hover:text-gold disabled:opacity-40">
                        <RotateCcw className="h-4 w-4" /> Restore
                      </button>
                    )}
                    <button onClick={deleteProject} disabled={busy} className="inline-flex items-center gap-2 border border-danger/40 px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-danger transition-colors hover:bg-danger hover:text-bone disabled:opacity-40">
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Project title" className="sm:col-span-2"><input className={fieldClass()} value={draft.name} onChange={(e) => updateName(e.target.value)} placeholder="e.g. Marion Apartment" /></Field>
                  <Field label="URL slug" hint={isNew ? "Auto-generated from the title — edit if needed. Used in the page address." : "The slug is fixed after creation to keep links stable."} className="sm:col-span-2">
                    <input className={fieldClass()} value={draft.slug} onChange={(e) => updateField("slug", slugify(e.target.value))} disabled={!isNew} placeholder="project-url-slug" />
                  </Field>
                  <Field label="Sector"><input className={fieldClass()} value={draft.sector} onChange={(e) => updateField("sector", e.target.value)} placeholder="e.g. Commercial / Banking" /></Field>
                  <Field label="Year"><input className={fieldClass()} type="number" value={draft.year} onChange={(e) => updateField("year", Number(e.target.value))} /></Field>
                  <Field label="Location"><input className={fieldClass()} value={draft.location} onChange={(e) => updateField("location", e.target.value)} /></Field>
                  <Field label="Client"><input className={fieldClass()} value={draft.client} onChange={(e) => updateField("client", e.target.value)} /></Field>
                  <Field label="Status">
                    <select className={fieldClass()} value={draft.status ?? "published"} onChange={(e) => updateField("status", e.target.value as ManagedProject["status"])}>
                      <option value="published">Published</option>
                      <option value="draft">Draft (hidden)</option>
                    </select>
                  </Field>
                  <Field label="Featured">
                    <select className={fieldClass()} value={draft.featured ? "yes" : "no"} onChange={(e) => updateField("featured", e.target.value === "yes")}>
                      <option value="yes">Featured on homepage</option>
                      <option value="no">Not featured</option>
                    </select>
                  </Field>
                  <Field label="Scope" className="sm:col-span-2"><textarea className={`${fieldClass()} min-h-28`} value={draft.scope} onChange={(e) => updateField("scope", e.target.value)} placeholder="Short line describing the work delivered" /></Field>
                  <Field label="Brief" className="sm:col-span-2"><textarea className={`${fieldClass()} min-h-40`} value={draft.brief} onChange={(e) => updateField("brief", e.target.value)} placeholder="A paragraph describing the project story" /></Field>
                </div>
              </Panel>

              {/* Cover preview */}
              <Panel tone="dark" className="p-5 md:p-6">
                <p className="eyebrow mb-4 text-gold">Live cover preview</p>
                <div className="relative aspect-[4/5] overflow-hidden bg-onyx">
                  {draft.cover ? (
                    <Image src={draft.cover} alt={draft.name} fill sizes="(min-width:1024px) 340px, 100vw" className="object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-bone/30"><ImagePlus className="h-10 w-10" strokeWidth={1} /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="font-mono text-xs text-gold">{draft.year}</p>
                    <h3 className="mt-1 font-display text-2xl leading-tight md:text-3xl">{draft.name || "Untitled"}</h3>
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
                  <h2 className="font-display text-2xl md:text-3xl">Manage images</h2>
                  <p className="mt-2 text-sm text-stone">Upload replacements, choose the cover, reorder images or remove mismatched visuals.</p>
                </div>
                <div>
                  <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadImages(e.target.files)} />
                  <Button icon={UploadCloud} loading={uploading} onClick={() => fileInput.current?.click()} className="w-full sm:w-auto">Upload images</Button>
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
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {draft.gallery.map((src, index) => (
                    <RiseCard key={`${src}-${index}`} delay={index * 0.03}>
                      <div className="border border-onyx/10 bg-ivory/40">
                        <div className="relative aspect-[4/3] overflow-hidden bg-graphite">
                          <Image src={src} alt={`${draft.name} ${index + 1}`} fill sizes="(min-width:1280px) 25vw, (min-width:640px) 33vw, 50vw" className="object-cover" />
                          {draft.cover === src && (
                            <span className="absolute left-2 top-2"><Badge tone="gold"><Star className="h-3 w-3 fill-current" /> Cover</Badge></span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-1 p-2 sm:p-3">
                          <button onClick={() => updateField("cover", src)} className="text-[10px] uppercase tracking-[0.14em] text-onyx/70 transition-colors hover:text-gold">Set cover</button>
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

  function addSlide() {
    setSlides((current) => [...current, { src: "", label: "", sector: "", year: String(new Date().getFullYear()) }]);
  }

  function removeSlide(index: number) {
    setSlides((current) => current.filter((_, i) => i !== index));
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
        desc="Add, remove or replace slider visuals and edit the labels shown in the first viewport."
        actions={
          <>
            <Button variant="quiet-dark" icon={Plus} onClick={addSlide}>Add slide</Button>
            <Button variant="quiet-dark" icon={RotateCcw} onClick={() => { setSlides(fallbackHeroSlides); toast.info("Original slider restored locally", "Save the slider to publish the restore."); }}>
              Restore
            </Button>
            <Button icon={Save} loading={saving} onClick={saveSlides}>Save slider</Button>
          </>
        }
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slides.length === 0 && (
          <div className="col-span-full border border-dashed border-white/15 bg-onyx/30 px-6 py-14 text-center">
            <p className="font-display text-xl text-bone">No slides yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-bone/50">Add a slide to build the homepage hero carousel.</p>
            <Button variant="ghost" icon={Plus} onClick={addSlide} className="mt-5">Add slide</Button>
          </div>
        )}
        {slides.map((slide, index) => (
          <div key={index} className="relative border border-white/10 bg-onyx/35 p-4">
            <button
              aria-label="Remove slide"
              onClick={() => removeSlide(index)}
              className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center bg-onyx/70 text-bone/70 backdrop-blur-sm transition-colors hover:bg-danger hover:text-bone"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative aspect-[4/3] overflow-hidden bg-onyx">
              {slide.src ? (
                <Image src={slide.src} alt={slide.label} fill sizes="(min-width:1024px) 28vw, (min-width:640px) 45vw, 100vw" className="object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-bone/25"><ImagePlus className="h-9 w-9" strokeWidth={1} /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-display text-xl leading-tight text-bone md:text-2xl">{slide.label || "Slide title"}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gold">{slide.sector || "Sector"} / {slide.year || "Year"}</p>
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
