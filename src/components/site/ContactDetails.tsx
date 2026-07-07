"use client";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { useSiteProfile } from "@/lib/useSiteContent";

/** Managed studio contact block used on the Contact page aside. */
export function ContactDetails() {
  const { profile } = useSiteProfile();
  return (
    <>
      <Reveal><p className="eyebrow">Studio</p></Reveal>
      <Reveal delay={0.1}>
        <div className="space-y-5 text-base text-stone leading-relaxed">
          <p className="flex gap-4"><MapPin className="h-5 w-5 text-gold mt-1 shrink-0" /><span>{profile.contact.address}</span></p>
          <p className="flex gap-4"><Mail className="h-5 w-5 text-gold mt-1 shrink-0" /><a className="text-onyx link-underline" href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a></p>
          <p className="flex gap-4"><Phone className="h-5 w-5 text-gold mt-1 shrink-0" /><a className="text-onyx link-underline" href={`tel:${profile.contact.phone.replace(/\s/g, "")}`}>{profile.contact.phone}</a></p>
          <p className="flex gap-4"><Clock className="h-5 w-5 text-gold mt-1 shrink-0" /><span>{profile.contact.hours}</span></p>
        </div>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="pt-6 border-t border-onyx/10">
          <p className="font-editorial italic text-xl text-onyx leading-snug">&ldquo;{profile.tagline.replace(/\.{3}/, "")}&rdquo;</p>
        </div>
      </Reveal>
    </>
  );
}
