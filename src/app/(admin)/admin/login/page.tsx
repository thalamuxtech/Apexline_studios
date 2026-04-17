"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, LogIn } from "lucide-react";
import { signInAdmin } from "@/lib/admin/client";
import { Input, Label } from "@/components/forms/Field";
import { BrandMark } from "@/components/site/BrandMark";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setBusy(true);
    const res = await signInAdmin(email, pw);
    setBusy(false);
    if (!res.ok) setErr(res.error);
    else router.replace("/admin");
  }

  return (
    <main className="min-h-[100svh] bg-onyx text-bone flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-10 gap-3">
          <Link href="/" aria-label="Return to home" className="inline-flex hover:opacity-80 transition-opacity">
            <BrandMark size={56} invert />
          </Link>
          <p className="text-[10px] uppercase tracking-[0.26em] text-gold">Studio Admin</p>
        </div>
        <div className="border border-white/10 bg-graphite p-8 md:p-10">
          <p className="eyebrow mb-3">Sign in</p>
          <h1 className="font-display text-3xl mb-8">Studio control room</h1>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="text-bone/90">
              <Label required>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="text-bone !border-white/25 placeholder:text-bone/30" placeholder="you@apexlinestudios.com" />
            </div>
            <div className="text-bone/90">
              <Label required>Password</Label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  required
                  minLength={6}
                  className="text-bone !border-white/25 placeholder:text-bone/30 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-bone/50 hover:text-gold transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {err && (
              <div className="flex items-start gap-3 text-sm text-danger">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>{err}</p>
              </div>
            )}
            <button disabled={busy} className="btn-primary w-full justify-center">
              {busy ? "Signing in..." : <>Sign in <LogIn className="h-4 w-4" /></>}
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between text-xs text-bone/50">
            <Link href="/" className="link-underline hover:text-gold">&larr; Return to site</Link>
            <span>Studio access only</span>
          </div>
        </div>
      </div>
    </main>
  );
}
