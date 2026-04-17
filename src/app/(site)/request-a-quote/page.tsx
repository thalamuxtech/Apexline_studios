import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Reveal } from "@/components/motion/Reveal";

export const metadata = { title: "Request a Quote", description: "Share your project brief with Apex-Line Studios." };

export default function QuotePage() {
  return (
    <>
      <Nav />
      <PageHeader eyebrow="Start a Project" title="Tell us about your project." lead="A short brief is all we need to start. A principal will review your submission and come back to you within two business days." />

      <section className="section bg-bone">
        <div className="container-apex max-w-4xl">
          <Reveal><QuoteForm /></Reveal>
        </div>
      </section>
    </>
  );
}
