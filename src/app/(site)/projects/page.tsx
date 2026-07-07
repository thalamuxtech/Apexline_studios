import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { ProjectsGrid } from "@/components/site/ProjectsGrid";

export const metadata = { title: "Work", description: "A selection of projects delivered by Apex-Line Studios across commercial, residential, healthcare and corporate sectors." };

export default function ProjectsIndex() {
  return (
    <>
      <Nav />
      <PageHeader
        eyebrow="Selected Work"
        title="Fifteen years, one standard of delivery."
        lead="A curated record of projects across commercial, residential, hospitality, healthcare and corporate sectors - each one a complete engagement from brief to handover."
      />

      <section className="section bg-bone">
        <div className="container-apex">
          <ProjectsGrid />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
