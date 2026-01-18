"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type ApiErrorShape =
    | { message?: string }
    | { errors?: Record<string, string[]> }
    | Array<{ code?: string; description?: string }>;

function pickErrorMessage(payload: unknown, fallback: string) {
    if (!payload) return fallback;

    if (typeof payload === "object" && !Array.isArray(payload)) {
        const obj = payload as any;

        if (typeof obj.message === "string" && obj.message.trim()) return obj.message;

        if (obj.errors && typeof obj.errors === "object") {
            const firstKey = Object.keys(obj.errors)[0];
            const firstArr = obj.errors[firstKey];
            if (Array.isArray(firstArr) && firstArr[0]) return String(firstArr[0]);
        }
    }

    if (Array.isArray(payload)) {
        const first = payload[0] as any;
        if (first?.description) return String(first.description);
    }

    return fallback;
}

function safeCallbackUrl(raw: string | null) {
    const fallback = "/";
    const v = raw?.trim() || fallback;
    if (!v.startsWith("/")) return fallback;
    if (v.startsWith("/auth/signin") || v.startsWith("/auth/register")) return fallback;
    return v;
}

export default function RegisterClient() {
    const router = useRouter();
    const sp = useSearchParams();
    const callbackUrl = useMemo(() => safeCallbackUrl(sp.get("callbackUrl")), [sp]);

    const { status } = useSession();

    useEffect(() => {
        if (status !== "authenticated") return;
        router.replace(callbackUrl);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, callbackUrl]);

    const [err, setErr] = useState<string | null>(null);
    const [ok, setOk] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const canSubmit = useMemo(() => {
        if (isLoading) return false;
        if (!userName.trim()) return false;
        if (!email.trim()) return false;
        if (!password) return false;
        if (password.length < 6) return false;
        return true;
    }, [userName, email, password, isLoading]);

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!canSubmit) return;

        setErr(null);
        setOk(null);
        setIsLoading(true);

        const currentEmail = email.trim();

        try {
            const res = await fetch(`/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName: userName.trim(),
                    email: currentEmail,
                    password,
                }),
            });

            const text = await res.text().catch(() => "");
            const maybeJson = (() => {
                try {
                    return text ? JSON.parse(text) : null;
                } catch {
                    return null;
                }
            })();

            if (!res.ok) {
                const msg = pickErrorMessage(maybeJson, text || "Registration failed.");
                setErr(msg);
                return;
            }

            setOk("Account created! Redirecting to sign in…");
            setUserName("");
            setEmail("");
            setPassword("");

            setTimeout(() => {
                router.push(
                    `/auth/signin?email=${encodeURIComponent(currentEmail)}&callbackUrl=${encodeURIComponent(
                        callbackUrl
                    )}`
                );
            }, 900);
        } catch (e: any) {
            setErr(e?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
            <div className="w-full rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl">
                <h1 className="text-2xl font-semibold">Create account</h1>

                <form onSubmit={submit} className="mt-6 space-y-3">
                    <input
                        name="userName"
                        type="text"
                        placeholder="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 outline-none placeholder:text-white/40"
                        required
                        disabled={isLoading}
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 outline-none placeholder:text-white/40"
                        required
                        disabled={isLoading}
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password (min 6 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 outline-none placeholder:text-white/40"
                        required
                        disabled={isLoading}
                    />

                    <button
                        disabled={!canSubmit}
                        className={`w-full rounded-2xl px-4 py-3 text-black transition ${canSubmit ? "bg-white hover:opacity-90" : "bg-white/40 cursor-not-allowed"
                            }`}
                    >
                        {isLoading ? "Creating…" : "Create"}
                    </button>
                </form>

                {err && (
                    <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                        {err}
                    </div>
                )}

                {ok && (
                    <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                        {ok}
                        <div className="mt-2">
                            <button
                                onClick={() =>
                                    router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
                                }
                                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white hover:bg-white/10"
                            >
                                Go to sign in now →
                            </button>
                        </div>
                    </div>
                )}

                <a className="mt-4 block text-sm text-white/70 hover:text-white" href="/auth/signin">
                    Back to sign in →
                </a>
            </div>
        </main>
    );
}