"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function safeCallbackUrl(raw: string | null) {
  const fallback = "/";
  const v = raw?.trim() || fallback;

  if (!v.startsWith("/")) return fallback;
  if (v.startsWith("/auth/signin") || v.startsWith("/auth/register")) return fallback;

  return v;
}

export default function SignInClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const callbackUrl = useMemo(() => safeCallbackUrl(sp.get("callbackUrl")), [sp]);

  const prefillEmail = useMemo(() => sp.get("email") || "", [sp]);

  const { status } = useSession();

  const [userNameOrEmail, setUserNameOrEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!prefillEmail) return;
    setUserNameOrEmail(prefillEmail);
  }, [prefillEmail]);

  useEffect(() => {
    if (status !== "authenticated") return;
    router.replace(callbackUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, callbackUrl]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setErr(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email: userNameOrEmail,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!res || res.error) {
      setErr("Invalid credentials.");
      return;
    }

    const url = res.url || callbackUrl;
    try {
      const u = new URL(url, window.location.origin);
      router.replace(u.pathname + u.search + u.hash);
    } catch {
      router.replace(callbackUrl);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="w-full rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-white/60">Use your Identity account.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            value={userNameOrEmail}
            onChange={(e) => setUserNameOrEmail(e.target.value)}
            name="email"
            type="text"
            placeholder="Email or Username"
            className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 outline-none placeholder:text-white/40"
            required
            autoComplete="username"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 outline-none placeholder:text-white/40"
            required
            autoComplete="current-password"
          />
          <button
            disabled={loading}
            className="w-full rounded-2xl bg-white px-4 py-3 text-black hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>

        {err && <p className="mt-3 text-sm text-red-300">{err}</p>}

        <a
          className="mt-4 block text-sm text-white/70 hover:text-white"
          href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        >
          Create an account →
        </a>
      </div>
    </main>
  );
}