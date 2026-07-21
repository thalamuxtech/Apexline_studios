"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ArrowDown, ArrowUp, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { getDb } from "@/lib/firebase/client";
import { useToast } from "@/components/admin/Toast";
import { Button, Panel, SectionHead, Field, fieldClass } from "@/components/admin/ui";
import { MarkProjects } from "@/components/admin/AdminIcons";
import {
  defaultNav, defaultFooter, cleanLinks,
  type NavLink, type FooterContent, type FooterLink,
} from "@/lib/useSiteContent";

export default function NavigationManager() {
  const toast = useToast();
  const [nav, setNav] = useState<NavLink[]>(defaultNav);
  const [footer, setFooter] = useState<FooterContent>(defaultFooter);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [navSnap, footerSnap] = await Promise.all([
          getDoc(doc(getDb(), "settings", "nav")),
          getDoc(doc(getDb(), "settings", "footer")),
        ]);
        const navRaw = cleanLinks((navSnap.data()?.items ?? []) as NavLink[]);
        const footerRaw = footerSnap.data()?.footer as FooterContent | undefined;
        if (live && navRaw.length) setNav(navRaw);
        if (live && footerRaw) setFooter({ ...defaultFooter, ...footerRaw, practiceLinks: footerRaw.practiceLinks ?? defaultFooter.practiceLinks, engageLinks: footerRaw.engageLinks ?? defaultFooter.engageLinks });
      } catch (e) { console.error(e); }
      finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, []);

  async function save() {
    setSaving(true);
    try {
      const navClean = cleanLinks(nav);
      const footerClean: FooterContent = {
        statementEyebrow: footer.statementEyebrow.trim(),
        statementTitle: footer.statementTitle.trim(),
        practiceLinks: cleanLinks(footer.practiceLinks),
        engageLinks: cleanLinks(footer.engageLinks),
      };
      await Promise.all([
        setDoc(doc(getDb(), "settings", "nav"), { items: navClean, updatedAt: serverTimestamp() }, { merge: true }),
        setDoc(doc(getDb(), "settings", "footer"), { footer: footerClean, updatedAt: serverTimestamp() }, { merge: true }),
      ]);
      setNav(navClean);
      setFooter(footerClean);
      toast.success("Navigation saved", "The site menu and footer now use these links.");
    } catch (e) {
      console.error(e);
      toast.error("Could not save", "Check Firebase permissions.");
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-8">
      <SectionHead
        mark={<MarkProjects size={48} />}
        eyebrow="Content · Navigation"
        title="Menu & footer links"
        desc="Edit the labels and destinations of the top navigation, the footer statement and the footer link columns. Reorder, rename, add or remove any link."
        actions={
          <>
            <Button variant="quiet" icon={RotateCcw} onClick={() => { setNav(defaultNav); setFooter(defaultFooter); toast.info("Defaults restored locally", "Save to publish."); }}>Restore</Button>
            <Button icon={Save} loading={saving} onClick={save}>Save navigation</Button>
          </>
        }
      />

      {loading ? (
        <div className="h-80 w-full animate-pulse bg-onyx/[0.06]" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel className="p-5 md:p-7">
            <LinkListEditor title="Top navigation" hint="Shown in the header and mobile menu." links={nav} onChange={setNav} />
          </Panel>

          <Panel className="p-5 md:p-7 space-y-6">
            <div>
              <p className="eyebrow mb-4 text-gold">Footer statement</p>
              <div className="grid gap-4">
                <Field label="Eyebrow"><input className={fieldClass()} value={footer.statementEyebrow} onChange={(e) => setFooter((f) => ({ ...f, statementEyebrow: e.target.value }))} /></Field>
                <Field label="Headline"><textarea className={`${fieldClass()} min-h-20`} value={footer.statementTitle} onChange={(e) => setFooter((f) => ({ ...f, statementTitle: e.target.value }))} /></Field>
              </div>
            </div>
          </Panel>

          <Panel className="p-5 md:p-7">
            <LinkListEditor title="Footer · Practice column" links={footer.practiceLinks} onChange={(l) => setFooter((f) => ({ ...f, practiceLinks: l }))} />
          </Panel>

          <Panel className="p-5 md:p-7">
            <LinkListEditor title="Footer · Engage column" links={footer.engageLinks} onChange={(l) => setFooter((f) => ({ ...f, engageLinks: l }))} />
          </Panel>
        </div>
      )}
    </div>
  );
}

function LinkListEditor({ title, hint, links, onChange }: { title: string; hint?: string; links: FooterLink[]; onChange: (l: FooterLink[]) => void }) {
  function update(index: number, patch: Partial<FooterLink>) {
    onChange(links.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  }
  function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= links.length) return;
    const next = [...links]; [next[index], next[j]] = [next[j], next[index]]; onChange(next);
  }
  return (
    <div>
      <p className="eyebrow mb-1 text-gold">{title}</p>
      {hint && <p className="mb-4 text-xs text-stone">{hint}</p>}
      <div className="space-y-3">
        {links.map((l, index) => (
          <div key={index} className="flex items-center gap-2">
            <input className={fieldClass()} value={l.label} onChange={(e) => update(index, { label: e.target.value })} placeholder="Label" />
            <input className={fieldClass()} value={l.href} onChange={(e) => update(index, { href: e.target.value })} placeholder="/path" />
            <div className="flex shrink-0 items-center gap-1">
              <button aria-label="Move up" onClick={() => move(index, -1)} disabled={index === 0} className="grid h-9 w-9 place-items-center border border-onyx/10 hover:border-gold disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
              <button aria-label="Move down" onClick={() => move(index, 1)} disabled={index === links.length - 1} className="grid h-9 w-9 place-items-center border border-onyx/10 hover:border-gold disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
              <button aria-label="Remove link" onClick={() => onChange(links.filter((_, j) => j !== index))} className="grid h-9 w-9 place-items-center border border-onyx/10 text-danger hover:border-danger"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
      <Button variant="quiet" icon={Plus} onClick={() => onChange([...links, { label: "New link", href: "/" }])} className="mt-4">Add link</Button>
    </div>
  );
}
