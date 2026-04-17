import { Marquee } from "@/components/motion/Marquee";
import { clientMarquee } from "@/content/site";

export function ClientMarquee() {
  return (
    <section className="bg-bone border-y border-onyx/10 py-6 md:py-8">
      <Marquee>
        {clientMarquee.map((c) => (
          <span key={c} className="font-display italic text-2xl md:text-3xl text-onyx/60 whitespace-nowrap">
            {c}
            <span className="mx-8 md:mx-12 text-gold">◇</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
