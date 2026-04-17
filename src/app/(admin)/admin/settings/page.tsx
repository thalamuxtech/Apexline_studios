"use client";
import { useEffect, useState } from "react";
import { siteConfig } from "@/content/site";
import { getFirebaseAuth } from "@/lib/firebase/client";

export default function SettingsPage() {
  const [email, setEmail] = useState<string>("");
  useEffect(() => {
    const auth = getFirebaseAuth();
    setEmail(auth.currentUser?.email ?? "");
    const u = auth.onAuthStateChanged((u) => setEmail(u?.email ?? ""));
    return () => u();
  }, []);

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <p className="eyebrow text-gold mb-3">Settings</p>
        <h1 className="font-display text-4xl md:text-5xl">Studio settings</h1>
      </header>

      <section className="border border-onyx/10 bg-white p-6 md:p-8 space-y-4">
        <h2 className="font-display text-xl">Account</h2>
        <dl className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
          <dt className="text-stone">Email</dt><dd className="break-all">{email || "—"}</dd>
          <dt className="text-stone">Role</dt><dd>Administrator</dd>
        </dl>
      </section>

      <section className="border border-onyx/10 bg-white p-6 md:p-8 space-y-4">
        <h2 className="font-display text-xl">Studio profile</h2>
        <dl className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
          <dt className="text-stone">Name</dt><dd>{siteConfig.name}</dd>
          <dt className="text-stone">Location</dt><dd>{siteConfig.location}</dd>
          <dt className="text-stone">Email</dt><dd>{siteConfig.contact.email}</dd>
          <dt className="text-stone">Phone</dt><dd>{siteConfig.contact.phone}</dd>
        </dl>
        <p className="text-xs text-stone">
          These values are stored in <code>src/content/site.ts</code> and deploy with the codebase.
        </p>
      </section>

      <section className="border border-onyx/10 bg-white p-6 md:p-8 space-y-3">
        <h2 className="font-display text-xl">Forms</h2>
        <p className="text-sm text-stone leading-relaxed">
          Four studio forms are live on the public site: Contact, Request-a-Quote, Careers and Trainee Applications. Submissions route into the Inbox automatically.
        </p>
        <ul className="text-sm space-y-1 text-onyx">
          <li>• Contact → <code>/contact</code></li>
          <li>• Request-a-Quote → <code>/request-a-quote</code></li>
          <li>• Careers → <code>/careers</code></li>
          <li>• Trainees → <code>/trainees</code></li>
        </ul>
      </section>
    </div>
  );
}
