import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Inbox, FolderKanban, Briefcase, Users, Settings, LogOut } from "lucide-react";
import { getSession } from "@/lib/admin/auth";
import { signOutAction } from "@/app/actions/auth";

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Login page and any sub-route of /admin/login get no chrome — the page itself handles its own layout.
  if (!session) {
    return <>{children}</>;
  }

  const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/leads", label: "Inbox", icon: Inbox },
    { href: "/admin/leads?formType=quote", label: "Quotes", icon: FolderKanban },
    { href: "/admin/leads?formType=careers", label: "Careers", icon: Briefcase },
    { href: "/admin/leads?formType=trainee", label: "Trainees", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-bone text-onyx">
      <div className="lg:flex">
        <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 border-b lg:border-b-0 lg:border-r border-onyx/10 bg-graphite text-bone flex lg:flex-col">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10 flex-1 lg:flex-none">
            <Image src="/brand/logo.png" alt="" width={32} height={32} className="h-8 w-auto" />
            <div>
              <p className="font-display text-lg leading-none">Apex-Line</p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-gold">Admin</p>
            </div>
          </div>
          <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 whitespace-nowrap">
                <item.icon className="h-4 w-4 text-gold shrink-0" strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="hidden lg:block px-5 py-5 border-t border-white/10 mt-auto">
            <p className="text-xs text-bone/60 mb-3">Signed in as</p>
            <p className="text-sm mb-4 truncate">{session.email}</p>
            <form action={signOutAction}>
              <button className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-bone/70 hover:text-gold">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="lg:hidden flex items-center justify-between px-5 py-3 border-b border-onyx/10 bg-bone">
            <span className="text-xs text-stone truncate max-w-[60%]">{session.email}</span>
            <form action={signOutAction}>
              <button className="text-xs uppercase tracking-[0.18em] text-onyx/70 hover:text-gold flex items-center gap-1">
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </form>
          </header>
          <div className="p-6 md:p-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
