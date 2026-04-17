import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/content/site";

export const metadata = { title: "Contact", description: "Speak with Apex-Line Studios — Lagos, Nigeria." };

export default function ContactPage() {
  return (
    <>
      <Nav />
      <PageHeader eyebrow="Contact" title="Begin a conversation." lead="Whether you have a site, a brief, or an idea that needs shaping — we would be glad to hear from you." />

      <section className="section bg-bone">
        <div className="container-apex grid md:grid-cols-12 gap-10 md:gap-16">
          <aside className="md:col-span-4 space-y-8">
            <Reveal><p className="eyebrow">Studio</p></Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-5 text-base text-stone leading-relaxed">
                <p className="flex gap-4"><MapPin className="h-5 w-5 text-gold mt-1 shrink-0" /><span>{siteConfig.contact.address}</span></p>
                <p className="flex gap-4"><Mail className="h-5 w-5 text-gold mt-1 shrink-0" /><a className="text-onyx link-underline" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></p>
                <p className="flex gap-4"><Phone className="h-5 w-5 text-gold mt-1 shrink-0" /><a className="text-onyx link-underline" href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}>{siteConfig.contact.phone}</a></p>
                <p className="flex gap-4"><Clock className="h-5 w-5 text-gold mt-1 shrink-0" /><span>{siteConfig.contact.hours}</span></p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="pt-6 border-t border-onyx/10">
                <p className="font-editorial italic text-xl text-onyx leading-snug">&ldquo;{siteConfig.tagline.replace(/\.{3}/, "")}&rdquo;</p>
              </div>
            </Reveal>
          </aside>
          <div className="md:col-span-8">
            <Reveal>
              <h2 className="font-display text-3xl md:text-4xl mb-8">Send us a note</h2>
            </Reveal>
            <Reveal delay={0.1}><ContactForm /></Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
