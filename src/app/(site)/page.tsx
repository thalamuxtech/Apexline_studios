import { Hero } from "@/components/site/Hero";
import { Manifesto } from "@/components/site/Manifesto";
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
      {/* Hero needs dark nav, so override */}
      <Nav variant="dark" />
      <Hero />
      <ClientMarquee />
      <Manifesto />
      <FeaturedProjects />
      <ServicesGrid />
      <Process />
      <Stats />
      <Testimonials />
      <CtaBand />
    </>
  );
}
