"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, siteConfig } from "@/content/site";
import { BrandMark } from "./BrandMark";

export function Nav({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // onDark = visually over a dark hero AND not yet scrolled.
  const onDark = variant === "dark" && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-apex",
          scrolled
            ? "bg-onyx/85 backdrop-blur-xl border-b border-white/10"
            : onDark
              ? "bg-transparent"
              : "bg-bone/85 backdrop-blur-md border-b border-onyx/5",
        )}
      >
        <div
          className={cn(
            "container-apex flex items-center justify-between transition-[height] duration-500 ease-apex",
            scrolled ? "h-16 md:h-20" : "h-24 md:h-32",
          )}
        >
          <Link href="/" className="flex items-center group" aria-label={siteConfig.name}>
            <BrandMark
              size={scrolled ? 36 : 64}
              invert={scrolled || onDark}
              className={cn(
                "transition-[height] duration-500 ease-apex",
                scrolled ? "md:!h-10" : "md:!h-20",
              )}
            />
          </Link>

          <nav className={cn(
            "hidden md:flex items-center gap-8 lg:gap-10",
            (scrolled || onDark) ? "text-bone" : "text-onyx",
          )}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-[13px] uppercase tracking-[0.18em] font-medium link-underline">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/request-a-quote"
              className={cn(
                "btn border",
                (scrolled || onDark)
                  ? "border-gold/70 text-bone hover:bg-gold hover:text-onyx"
                  : "border-onyx/80 text-onyx hover:bg-onyx hover:text-bone",
              )}
            >
              Start a Project
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className={cn(
              "md:hidden p-2 -mr-2",
              (scrolled || onDark) ? "text-bone" : "text-onyx",
            )}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-onyx text-bone md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-6">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <BrandMark size={40} invert />
              </Link>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2 -mr-2">
                <X className="h-6 w-6" />
              </button>
            </div>
            <motion.nav
              initial="hidden" animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
              className="flex flex-col px-6 pt-8 pb-10 gap-2"
            >
              {navLinks.map((l) => (
                <motion.div key={l.href} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-white/10 py-5 font-display text-3xl tracking-tight"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="pt-6">
                <Link href="/request-a-quote" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
                  Start a Project
                </Link>
              </motion.div>
              <motion.p variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="pt-10 text-xs uppercase tracking-[0.22em] text-gold">
                {siteConfig.location}
              </motion.p>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
