"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, Menu, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function HeaderClient({
    isAuthed,
    userName,
}: {
    isAuthed: boolean;
    userName: string;
}) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    const desktopNav = (
        <nav className="hidden md:flex items-center gap-3 text-sm">
            <Link className="text-white/80 hover:text-white" href="/about">
                About
            </Link>

            <Link
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white/90 hover:bg-white/10"
                href="/favorites"
            >
                <Star size={16} /> Favorites
            </Link>

            {!isAuthed ? (
                <Link
                    className="rounded-xl bg-white px-3 py-2 text-black hover:opacity-90"
                    href="/auth/signin"
                >
                    Sign in
                </Link>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="hidden lg:inline text-white/70">
                        Hi, <span className="text-white">{userName}</span>
                    </span>

                    <form action="/api/auth/signout" method="post">
                        <button
                            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white/90 hover:bg-white/10"
                            type="submit"
                        >
                            <LogOut size={16} /> Sign out
                        </button>
                    </form>
                </div>
            )}
        </nav>
    );

    const mobileButton = (
        <button
            className="md:hidden inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 p-2 text-white hover:bg-white/10"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
        >
            <Menu size={18} />
        </button>
    );

    return (
        <>
            {desktopNav}
            {mobileButton}

            <AnimatePresence>
                {open && (
                    <>
                        <motion.button
                            type="button"
                            aria-label="Close menu"
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                        />

                        <motion.aside
                            className="fixed right-0 top-0 z-50 h-dvh w-[86vw] max-w-sm border-l border-white/10 bg-black/80 p-4 backdrop-blur-xl md:hidden"
                            initial={{ x: 40, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 40, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-white/70">Menu</div>
                                <button
                                    className="rounded-2xl border border-white/15 bg-white/5 p-2 text-white hover:bg-white/10"
                                    onClick={() => setOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {isAuthed ? (
                                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <div className="text-xs text-white/60">Signed in as</div>
                                    <div className="mt-1 text-sm font-semibold text-white">{userName}</div>
                                </div>
                            ) : (
                                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <div className="text-sm text-white/80">You’re not signed in.</div>
                                </div>
                            )}

                            <div className="mt-4 space-y-2">
                                <Link
                                    href="/about"
                                    className="block rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/90 hover:bg-white/10"
                                    onClick={() => setOpen(false)}
                                >
                                    About
                                </Link>

                                <Link
                                    href="/favorites"
                                    className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/90 hover:bg-white/10"
                                    onClick={() => setOpen(false)}
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <Star size={16} /> Favorites
                                    </span>
                                    <span className="text-xs text-white/60">Saved</span>
                                </Link>

                                {!isAuthed ? (
                                    <>
                                        <Link
                                            href="/auth/signin"
                                            className="block rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-black hover:opacity-90"
                                            onClick={() => setOpen(false)}
                                        >
                                            Sign in
                                        </Link>
                                        <Link
                                            href="/auth/register"
                                            className="block rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm text-white/90 hover:bg-white/10"
                                            onClick={() => setOpen(false)}
                                        >
                                            Create account
                                        </Link>
                                    </>
                                ) : (
                                    <form action="/api/auth/signout" method="post" className="pt-2">
                                        <button
                                            className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/90 hover:bg-white/10"
                                            type="submit"
                                        >
                                            <span className="inline-flex items-center justify-center gap-2">
                                                <LogOut size={16} /> Sign out
                                            </span>
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}