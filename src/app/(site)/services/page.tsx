import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";
import { ServicesGrid } from "@/components/site/ServicesGrid";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata = { title: "Services", description: "Architecture, construction, interior and exterior design — delivered under one studio." };

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <PageHeader
        eyebrow="What we do"
        title="End-to-end design and delivery, held to one standard."
        lead="Every discipline our clients need — architectural design, construction management, interior and exterior works, renovations and project consultancy — delivered in-house by the team you brief."
      />
      <ServicesGrid />
      <CtaBand />
    </>
  );
}
