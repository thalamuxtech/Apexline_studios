"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, siteConfig } from "@/content/site";

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

  const onDark = variant === "dark" && !scrolled;
  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-apex",
          scrolled ? "bg-onyx/80 backdrop-blur-xl border-b border-white/5" : onDark ? "bg-transparent" : "bg-bone/80 backdrop-blur-md",
        )}
      >
        <div className="container-apex flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" aria-label={siteConfig.name}>
            <Image src="/brand/logo.png" alt="Apex-Line Studios" width={42} height={42} className="h-9 w-auto md:h-10" priority />
            <span className={cn("hidden sm:flex flex-col leading-none", (scrolled || !onDark) ? "text-onyx" : "text-bone")}>
              <span className="font-display text-lg md:text-xl tracking-tight">Apex-Line</span>
              <span className="text-[10px] uppercase tracking-[0.24em] opacity-70">Studios</span>
            </span>
            <span className={cn("sm:hidden font-display text-lg tracking-tight", (scrolled || !onDark) ? "text-onyx" : "text-bone")}>Apex-Line</span>
          </Link>

          <nav className={cn("hidden md:flex items-center gap-8 lg:gap-10", (scrolled || !onDark) ? "text-onyx" : "text-bone")}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-[13px] uppercase tracking-[0.18em] font-medium link-underline">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link href="/request-a-quote" className={cn("btn border", (scrolled || !onDark) ? "border-onyx/80 text-onyx hover:bg-onyx hover:text-bone" : "border-gold/60 text-bone hover:bg-gold hover:text-onyx")}>
              Start a Project
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className={cn("md:hidden p-2 -mr-2", (scrolled || !onDark) ? "text-onyx" : "text-bone")}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-onyx text-bone md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-6">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <Image src="/brand/logo.png" alt="" width={36} height={36} className="h-9 w-auto" />
                <span className="font-display text-lg">Apex-Line</span>
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
                <motion.div
                  key={l.href}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                >
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
