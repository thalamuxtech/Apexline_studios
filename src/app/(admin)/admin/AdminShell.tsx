"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Loader2, ShieldOff, Menu, X, ExternalLink } from "lucide-react";
import { listenAdmin, signOutAdmin, type AdminState } from "@/lib/admin/client";
import { BrandMark } from "@/components/site/BrandMark";
import { ToastProvider } from "@/components/admin/Toast";
import {
  MarkOverview, MarkInbox, MarkProjects, MarkHero, MarkServices,
  MarkTestimonials, MarkStats, MarkProfile,
} from "@/components/admin/AdminIcons";

type NavItem = { href: string; label: string; Mark: (p: { size?: number }) => React.ReactNode };
type NavGroup = { group: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", Mark: MarkOverview },
      { href: "/admin/leads", label: "Inbox", Mark: MarkInbox },
    ],
  },
  {
    group: "Content",
    items: [
      { href: "/admin/projects", label: "Projects & Hero", Mark: MarkProjects },
      { href: "/admin/content/services", label: "Services", Mark: MarkServices },
      { href: "/admin/content/process", label: "Process", Mark: MarkStats },
      { href: "/admin/content/testimonials", label: "Testimonials", Mark: MarkTestimonials },
      { href: "/admin/content/journal", label: "Journal", Mark: MarkTestimonials },
      { href: "/admin/content/about", label: "About / Studio", Mark: MarkProfile },
      { href: "/admin/content/stats", label: "Stats & Clients", Mark: MarkStats },
      { href: "/admin/content/profile", label: "Studio Profile", Mark: MarkProfile },
      { href: "/admin/content/navigation", label: "Menu & Footer", Mark: MarkProjects },
    ],
  },
  {
    group: "Studio",
    items: [
      { href: "/admin/settings", label: "Settings", Mark: MarkHero },
    ],
  },
];

function isActive(pathname: string, href: string) {
  const base = href.split("?")[0];
  if (base === "/admin") return pathname === "/admin";
  return pathname === base || pathname.startsWith(base + "/");
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [state, setState] = useState<AdminState>({ status: "loading" });
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoginRoute = pathname.startsWith("/admin/login");

  useEffect(() => listenAdmin(setState), []);
  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    if (state.status === "unauthenticated" && !isLoginRoute) router.replace("/admin/login");
    if (state.status === "authenticated" && isLoginRoute) router.replace("/admin");
  }, [state, isLoginRoute, router]);

  if (isLoginRoute) return <>{children}</>;

  if (state.status === "loading" || state.status === "unauthenticated") {
    return (
      <div className="grid min-h-[100svh] place-items-center bg-onyx text-bone">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin text-gold" />
          <p className="text-[10px] uppercase tracking-[0.24em] text-bone/40">Verifying studio access</p>
        </div>
      </div>
    );
  }

  if (state.status === "forbidden") {
    return (
      <div className="grid min-h-[100svh] place-items-center bg-onyx px-6 py-12 text-bone">
        <div className="max-w-md text-center">
          <ShieldOff className="mx-auto mb-6 h-10 w-10 text-danger" strokeWidth={1.25} />
          <h1 className="font-display text-3xl">Access denied</h1>
          <p className="mt-3 leading-relaxed text-bone/70">
            Your account ({state.user.email}) does not have admin permissions on this studio.
          </p>
          <button onClick={() => signOutAdmin()} className="btn-ghost mx-auto mt-8">Sign out</button>
        </div>
      </div>
    );
  }

  const email = state.user.email;

  const renderSidebar = (idPrefix: string) => (
    <div className="flex h-full flex-col bg-graphite text-bone">
      <Link
        href="/"
        aria-label="Visit public site"
        className="group flex items-center gap-3 border-b border-white/10 px-6 py-6 transition-colors hover:bg-white/5"
      >
        <BrandMark size={34} invert />
        <span className="ml-auto flex items-center gap-1 self-end pb-1 text-[10px] uppercase tracking-[0.24em] text-gold">
          Admin
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-6">
        {NAV.map((section) => (
          <div key={section.group} className="mb-6">
            <p className="px-3 pb-2 text-[9px] uppercase tracking-[0.28em] text-bone/35">{section.group}</p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                      active ? "text-bone" : "text-bone/60 hover:text-bone"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId={`${idPrefix}-nav-active`}
                        className="pointer-events-none absolute inset-0 border border-gold/30 bg-gold/10"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="pointer-events-none relative z-10 shrink-0"><item.Mark size={24} /></span>
                    <span className="pointer-events-none relative z-10 whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-5">
        <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-bone/40">Signed in as</p>
        <p className="mb-4 truncate text-sm">{email}</p>
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-bone/60 hover:text-gold">
            <ExternalLink className="h-3.5 w-3.5" /> View site
          </Link>
          <button onClick={() => signOutAdmin()} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-bone/60 hover:text-gold">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-bone text-onyx">
        <div className="lg:flex">
          {/* Desktop sidebar */}
          <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:w-72 lg:shrink-0 lg:border-r lg:border-white/10">
            {renderSidebar("desktop")}
          </aside>

          {/* Mobile drawer */}
          <AnimatePresence>
            {mobileOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setMobileOpen(false)}
                  className="absolute inset-0 bg-onyx/60 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  className="absolute inset-y-0 left-0 w-72 max-w-[82vw] shadow-2xl"
                >
                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    className="absolute right-3 top-5 z-20 grid h-9 w-9 place-items-center text-bone/60 hover:text-gold"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  {renderSidebar("mobile")}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="min-w-0 flex-1">
            {/* Mobile top bar */}
            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-onyx/10 bg-bone/90 px-4 py-3 backdrop-blur-md lg:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="grid h-10 w-10 place-items-center border border-onyx/10 text-onyx hover:border-gold"
              >
                <Menu className="h-5 w-5" />
              </button>
              <BrandMark size={26} />
              <button onClick={() => signOutAdmin()} aria-label="Sign out" className="grid h-10 w-10 place-items-center text-onyx/60 hover:text-gold">
                <LogOut className="h-4 w-4" />
              </button>
            </header>

            <div className="p-5 md:p-8 lg:p-10">{children}</div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
