"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { signInAction } from "@/app/actions/auth";
import { Input, Label } from "@/components/forms/Field";
import Image from "next/image";
import { AlertCircle, LogIn } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setBusy(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, pw);
      const idToken = await cred.user.getIdToken();
      const res = await signInAction(idToken);
      if (!res.ok) throw new Error(res.error);
      router.push("/admin");
    } catch (e: any) {
      setErr(e?.message?.replace("Firebase: ", "") ?? "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[100svh] bg-onyx text-bone flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-10">
          <Image src="/brand/logo.png" alt="" width={48} height={48} className="h-12 w-auto" />
          <div className="text-left">
            <p className="font-display text-2xl leading-none">Apex-Line</p>
            <p className="text-[10px] uppercase tracking-[0.26em] text-gold">Studio Admin</p>
          </div>
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
              <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required minLength={6} className="text-bone !border-white/25 placeholder:text-bone/30" />
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
          <p className="mt-6 text-xs text-bone/50 leading-relaxed">
            Access is restricted to authorised studio email addresses. Contact the principal if you need access.
          </p>
        </div>
      </div>
    </main>
  );
}
