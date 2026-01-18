"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { ArrowRight, Radar, Sparkles, ShieldCheck } from "lucide-react";

function useParallax() {
    const mx = useMotionValue(0);
    const my = useMotionValue(0);

    const sx = useSpring(mx, { stiffness: 90, damping: 18 });
    const sy = useSpring(my, { stiffness: 90, damping: 18 });

    const xSmall = useTransform(sx, [-0.5, 0.5], [-10, 10]);
    const ySmall = useTransform(sy, [-0.5, 0.5], [-10, 10]);

    const xMed = useTransform(sx, [-0.5, 0.5], [-18, 18]);
    const yMed = useTransform(sy, [-0.5, 0.5], [-18, 18]);

    const xBig = useTransform(sx, [-0.5, 0.5], [-26, 26]);
    const yBig = useTransform(sy, [-0.5, 0.5], [-26, 26]);

    return {
        onMove: (e: React.MouseEvent) => {
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            mx.set(px);
            my.set(py);
        },
        onLeave: () => {
            mx.set(0);
            my.set(0);
        },
        xSmall,
        ySmall,
        xMed,
        yMed,
        xBig,
        yBig,
    };
}

function RadarSweep() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 opacity-[0.18] [mask-image:radial-gradient(circle_at_center,black,transparent_62%)]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:52px_52px]" />
            </div>

            <motion.div
                className="absolute left-1/2 top-1/2 h-[980px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                    background:
                        "conic-gradient(from 0deg, rgba(120,210,255,.0), rgba(120,210,255,.28), rgba(120,210,255,.0) 55%)",
                    filter: "blur(1px)",
                    opacity: 0.9,
                    maskImage: "radial-gradient(circle at center, black 0%, transparent 66%)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
}

export function HomeHero() {
    const p = useParallax();

    useEffect(() => {
        // subtle “ambient motion” even without mouse
    }, []);

    return (
        <section className="py-10">
            <div
                onMouseMove={p.onMove}
                onMouseLeave={p.onLeave}
                className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl"
            >
                {/* Glow blobs */}
                <motion.div
                    className="absolute -left-24 -top-28 h-[360px] w-[360px] rounded-full blur-3xl opacity-30"
                    style={{
                        background:
                            "radial-gradient(circle at 30% 30%, rgba(80,170,255,.8), transparent 60%)",
                        x: p.xSmall,
                        y: p.ySmall,
                    }}
                />
                <motion.div
                    className="absolute -bottom-28 -right-24 h-[380px] w-[380px] rounded-full blur-3xl opacity-25"
                    style={{
                        background:
                            "radial-gradient(circle at 30% 30%, rgba(190,120,255,.7), transparent 60%)",
                        x: p.xMed,
                        y: p.yMed,
                    }}
                />

                <RadarSweep />

                <div className="relative grid gap-8 md:grid-cols-12">
                    <div className="md:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 text-xs text-white/70"
                        >
                            <Sparkles size={14} />
                            AeroPulse
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.05 }}
                            className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl"
                        >
                            Track flights like a{" "}
                            <span className="text-white/90">control room</span>.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.1 }}
                            className="mt-4 max-w-xl text-white/70"
                        >
                            Arrivals & departures, fast search, and favorites tied to your ASP.NET Identity account.
                            Designed to feel modern, premium, and instant.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.15 }}
                            className="mt-6 flex flex-wrap gap-3"
                        >
                            <a
                                href="#flights"
                                className="group inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black hover:opacity-90"
                            >
                                Open flight board{" "}
                                <span className="transition-transform group-hover:translate-x-0.5">
                                    <ArrowRight size={16} />
                                </span>
                            </a>

                            <a
                                href="/favorites"
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white hover:bg-white/10"
                            >
                                <ShieldCheck size={16} /> Favorites (protected)
                            </a>

                            <a
                                href="/about"
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white/90 hover:bg-white/10"
                            >
                                <Radar size={16} /> About
                            </a>
                        </motion.div>
                    </div>

                    {/* Floating “mini cards” */}
                    <div className="md:col-span-5">
                        <motion.div
                            className="grid gap-3"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <motion.div
                                style={{ x: p.xBig, y: p.yBig }}
                                className="rounded-2xl border border-white/15 bg-black/30 p-4"
                            >
                                <div className="text-xs text-white/60">Live status</div>
                                <div className="mt-1 text-lg font-semibold">Boarding & Gate changes</div>
                                <div className="mt-2 text-sm text-white/70">
                                    Built for real-time dashboards (polling / websockets later).
                                </div>
                            </motion.div>

                            <motion.div
                                style={{ x: p.xMed, y: p.yMed }}
                                className="rounded-2xl border border-white/15 bg-black/30 p-4"
                            >
                                <div className="text-xs text-white/60">Fast search</div>
                                <div className="mt-1 text-lg font-semibold">Flight No, airline, city</div>
                                <div className="mt-2 text-sm text-white/70">
                                    Keyboard-first UX + clean filters.
                                </div>
                            </motion.div>

                            <motion.div
                                style={{ x: p.xSmall, y: p.ySmall }}
                                className="rounded-2xl border border-white/15 bg-black/30 p-4"
                            >
                                <div className="text-xs text-white/60">Favorites</div>
                                <div className="mt-1 text-lg font-semibold">Saved per user session</div>
                                <div className="mt-2 text-sm text-white/70">
                                    Redirect-to-login when unauthenticated.
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom “stats strip” */}
                <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
                    {[
                        { label: "Uptime", value: "99.9%" },
                        { label: "Avg. response", value: "120ms" },
                        { label: "Security", value: "Identity + JWT" },
                    ].map((x) => (
                        <div
                            key={x.label}
                            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                        >
                            <div className="text-xs text-white/60">{x.label}</div>
                            <div className="mt-1 text-lg font-semibold">{x.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}