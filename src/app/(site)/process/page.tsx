import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";
import { Process } from "@/components/site/Process";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata = { title: "Process", description: "Six disciplined steps from brief to handover." };

export default function ProcessPage() {
  return (
    <>
      <Nav />
      <PageHeader eyebrow="Our Method" title="Six disciplined steps from brief to handover." lead="Nothing we deliver is improvised on site. Every phase has a deliverable, a sign-off and an owner." />
      <Process />
      <CtaBand />
    </>
  );
}
