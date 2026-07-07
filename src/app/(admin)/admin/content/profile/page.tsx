"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, RotateCcw, Save, Palette } from "lucide-react";
import { getDb } from "@/lib/firebase/client";
import { useToast } from "@/components/admin/Toast";
import { Button, Panel, SectionHead, Field, fieldClass, Skeleton } from "@/components/admin/ui";
import { MarkProfile } from "@/components/admin/AdminIcons";
import { defaultProfile, type SiteProfile } from "@/lib/useSiteContent";

export default function ProfileManager() {
  const toast = useToast();
  const [profile, setProfile] = useState<SiteProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const snap = await getDoc(doc(getDb(), "settings", "profile"));
        const raw = snap.data()?.profile as SiteProfile | undefined;
        if (live && raw) setProfile({ ...defaultProfile, ...raw, contact: { ...defaultProfile.contact, ...raw.contact }, social: { ...defaultProfile.social, ...raw.social } });
      } catch (e) { console.error(e); }
      finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, []);

  function set<K extends keyof SiteProfile>(key: K, value: SiteProfile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }
  function setContact(key: keyof SiteProfile["contact"], value: string) {
    setProfile((p) => ({ ...p, contact: { ...p.contact, [key]: value } }));
  }
  function setSocial(key: keyof SiteProfile["social"], value: string) {
    setProfile((p) => ({ ...p, social: { ...p.social, [key]: value } }));
  }

  async function save() {
    setSaving(true);
    try {
      await setDoc(doc(getDb(), "settings", "profile"), { profile, updatedAt: serverTimestamp() }, { merge: true });
      toast.success("Studio profile saved", "Contact details and socials update across the footer and contact page.");
    } catch (e) {
      console.error(e);
      toast.error("Could not save profile", "Check Firebase permissions.");
    } finally { setSaving(false); }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHead
        mark={<MarkProfile size={48} />}
        eyebrow="Content · Studio"
        title="Studio profile"
        desc="The tagline, contact details and social links used across the footer and contact page."
        actions={
          <>
            <Button variant="quiet" icon={RotateCcw} onClick={() => { setProfile(defaultProfile); toast.info("Original profile restored locally", "Save to publish."); }}>Restore</Button>
            <Button icon={Save} loading={saving} onClick={save}>Save profile</Button>
          </>
        }
      />

      {/* Brand voice */}
      <Panel className="p-5 md:p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-gold/30 bg-gold/10"><Palette className="h-4 w-4 text-gold" /></span>
          <h3 className="font-display text-2xl">Brand voice</h3>
        </div>
        <div className="grid gap-4">
          <Field label="Tagline" hint="Shown large in the footer and contact aside."><input className={`${fieldClass()} font-editorial text-lg italic`} value={profile.tagline} onChange={(e) => set("tagline", e.target.value)} /></Field>
          <Field label="Description" hint="Used for SEO / meta description."><textarea className={`${fieldClass()} min-h-28`} value={profile.description} onChange={(e) => set("description", e.target.value)} /></Field>
        </div>
      </Panel>

      {/* Contact */}
      <Panel className="p-5 md:p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-gold/30 bg-gold/10"><Phone className="h-4 w-4 text-gold" /></span>
          <h3 className="font-display text-2xl">Contact details</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Email"><IconInput icon={Mail} type="email" value={profile.contact.email} onChange={(v) => setContact("email", v)} /></Field>
          <Field label="Phone"><IconInput icon={Phone} value={profile.contact.phone} onChange={(v) => setContact("phone", v)} /></Field>
          <Field label="Address"><IconInput icon={MapPin} value={profile.contact.address} onChange={(v) => setContact("address", v)} /></Field>
          <Field label="Hours"><IconInput icon={Clock} value={profile.contact.hours} onChange={(v) => setContact("hours", v)} /></Field>
        </div>
      </Panel>

      {/* Social */}
      <Panel className="p-5 md:p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-gold/30 bg-gold/10"><Instagram className="h-4 w-4 text-gold" /></span>
          <h3 className="font-display text-2xl">Social links</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Facebook"><IconInput icon={Facebook} value={profile.social.facebook} onChange={(v) => setSocial("facebook", v)} /></Field>
          <Field label="Instagram"><IconInput icon={Instagram} value={profile.social.instagram} onChange={(v) => setSocial("instagram", v)} /></Field>
          <Field label="LinkedIn"><IconInput icon={Linkedin} value={profile.social.linkedin} onChange={(v) => setSocial("linkedin", v)} /></Field>
          <Field label="Behance"><IconInput icon={Palette} value={profile.social.behance} onChange={(v) => setSocial("behance", v)} /></Field>
        </div>
      </Panel>
    </div>
  );
}

function IconInput({
  icon: Icon, value, onChange, type = "text",
}: { icon: React.ComponentType<{ className?: string }>; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
      <input type={type} className={`${fieldClass()} pl-10`} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
