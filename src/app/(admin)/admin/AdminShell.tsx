"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Inbox, FolderKanban, Briefcase, Users, Settings, LogOut, Loader2, ShieldOff } from "lucide-react";
import { listenAdmin, signOutAdmin, type AdminState } from "@/lib/admin/client";
import { BrandMark } from "@/components/site/BrandMark";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Inbox", icon: Inbox },
  { href: "/admin/leads?formType=quote", label: "Quotes", icon: FolderKanban },
  { href: "/admin/leads?formType=careers", label: "Careers", icon: Briefcase },
  { href: "/admin/leads?formType=trainee", label: "Trainees", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [state, setState] = useState<AdminState>({ status: "loading" });
  const isLoginRoute = pathname.startsWith("/admin/login");

  useEffect(() => listenAdmin(setState), []);

  useEffect(() => {
    if (state.status === "unauthenticated" && !isLoginRoute) router.replace("/admin/login");
    if (state.status === "authenticated" && isLoginRoute) router.replace("/admin");
  }, [state, isLoginRoute, router]);

  // Login route is its own page; no chrome
  if (isLoginRoute) return <>{children}</>;

  if (state.status === "loading") {
    return (
      <div className="min-h-[100svh] flex items-center justify-center bg-onyx text-bone">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (state.status === "unauthenticated") {
    return (
      <div className="min-h-[100svh] flex items-center justify-center bg-onyx text-bone">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (state.status === "forbidden") {
    return (
      <div className="min-h-[100svh] bg-onyx text-bone flex items-center justify-center px-6 py-12">
        <div className="max-w-md text-center">
          <ShieldOff className="h-10 w-10 text-danger mx-auto mb-6" strokeWidth={1.25} />
          <h1 className="font-display text-3xl">Access denied</h1>
          <p className="mt-3 text-bone/70 leading-relaxed">
            Your account ({state.user.email}) does not have admin permissions on this studio.
          </p>
          <button onClick={() => signOutAdmin()} className="btn-ghost mt-8 mx-auto">Sign out</button>
        </div>
      </div>
    );
  }

  const email = state.user.email;

  return (
    <div className="min-h-screen bg-bone text-onyx">
      <div className="lg:flex">
        <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 border-b lg:border-b-0 lg:border-r border-onyx/10 bg-graphite text-bone flex lg:flex-col">
          <Link
            href="/"
            aria-label="Visit public site"
            className="flex items-center gap-3 px-6 py-5 border-b border-white/10 flex-1 lg:flex-none hover:bg-white/5 transition-colors"
          >
            <BrandMark size={36} invert />
            <p className="text-[10px] uppercase tracking-[0.24em] text-gold self-end pb-1">Admin</p>
          </Link>
          <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 whitespace-nowrap">
                <item.icon className="h-4 w-4 text-gold shrink-0" strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="hidden lg:block px-5 py-5 border-t border-white/10 mt-auto">
            <p className="text-xs text-bone/60 mb-3">Signed in as</p>
            <p className="text-sm mb-4 truncate">{email}</p>
            <button onClick={() => signOutAdmin()} className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-bone/70 hover:text-gold">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="lg:hidden flex items-center justify-between px-5 py-3 border-b border-onyx/10 bg-bone">
            <span className="text-xs text-stone truncate max-w-[60%]">{email}</span>
            <button onClick={() => signOutAdmin()} className="text-xs uppercase tracking-[0.18em] text-onyx/70 hover:text-gold flex items-center gap-1">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </header>
          <div className="p-6 md:p-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
