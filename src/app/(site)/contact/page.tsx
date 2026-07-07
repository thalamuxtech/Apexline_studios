import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { ContactDetails } from "@/components/site/ContactDetails";

export const metadata = { title: "Contact", description: "Speak with Apex-Line Studios — Lagos, Nigeria." };

export default function ContactPage() {
  return (
    <>
      <Nav />
      <PageHeader eyebrow="Contact" title="Begin a conversation." lead="Whether you have a site, a brief, or an idea that needs shaping — we would be glad to hear from you." />

      <section className="section bg-bone">
        <div className="container-apex grid md:grid-cols-12 gap-10 md:gap-16">
          <aside className="md:col-span-4 space-y-8">
            <ContactDetails />
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
