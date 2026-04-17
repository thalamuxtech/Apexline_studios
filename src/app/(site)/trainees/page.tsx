import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";
import { TraineeForm } from "@/components/forms/TraineeForm";
import { Reveal } from "@/components/motion/Reveal";

export const metadata = { title: "Internship & Training", description: "Apex-Line Studios runs structured placements for students and graduates in architecture, construction and interior design." };

export default function TraineesPage() {
  return (
    <>
      <Nav />
      <PageHeader eyebrow="Internship & Training" title="Learn the craft on real projects." lead="Our structured training placements pair students and graduates with principals on live projects across architecture, construction and interior design." />

      <section className="section bg-bone">
        <div className="container-apex max-w-3xl">
          <Reveal><TraineeForm /></Reveal>
        </div>
      </section>
    </>
  );
}
