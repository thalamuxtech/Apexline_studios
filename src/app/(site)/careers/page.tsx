import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";
import { CareersForm } from "@/components/forms/CareersForm";
import { Reveal } from "@/components/motion/Reveal";

export const metadata = { title: "Careers", description: "Join Apex-Line Studios. Architects, engineers, designers and project managers." };

export default function CareersPage() {
  return (
    <>
      <Nav />
      <PageHeader eyebrow="Careers" title="Build the skyline with us." lead="We hire architects, engineers, designers and project managers who take craft seriously and see site work as where the discipline is earned." />

      <section className="section bg-bone">
        <div className="container-apex max-w-3xl">
          <Reveal><CareersForm /></Reveal>
        </div>
      </section>
    </>
  );
}
