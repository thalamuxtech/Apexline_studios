import { Hero } from "@/components/site/Hero";
import { Manifesto } from "@/components/site/Manifesto";
import { Approach } from "@/components/site/Approach";
import { FeaturedProjects } from "@/components/site/FeaturedProjects";
import { ServicesGrid } from "@/components/site/ServicesGrid";
import { Process } from "@/components/site/Process";
import { Stats } from "@/components/site/Stats";
import { Testimonials } from "@/components/site/Testimonials";
import { CtaBand } from "@/components/site/CtaBand";
import { ClientMarquee } from "@/components/site/ClientMarquee";
import { Nav } from "@/components/site/Nav";

export default function LandingPage() {
  return (
    <>
      <Nav variant="dark" />
      <Hero />
      <ClientMarquee />
      <Manifesto />
      <FeaturedProjects />
      <Approach />
      <ServicesGrid />
      <Process />
      <Stats />
      <Testimonials />
      <CtaBand />
    </>
  );
}
