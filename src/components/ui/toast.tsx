"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";
type ToastItem = { id: string; type: ToastType; title: string; message?: string };

const ToastCtx = createContext<{
    push: (t: Omit<ToastItem, "id">) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ToastItem[]>([]);

    const push = useCallback((t: Omit<ToastItem, "id">) => {
        const id = crypto.randomUUID();
        const toast: ToastItem = { id, ...t };
        setItems((prev) => [...prev, toast]);

        window.setTimeout(() => {
            setItems((prev) => prev.filter((x) => x.id !== id));
        }, 2800);
    }, []);

    const value = useMemo(() => ({ push }), [push]);

    return (
        <ToastCtx.Provider value={value}>
            {children}

            <div className="pointer-events-none fixed right-4 top-4 z-[9999] w-[360px] max-w-[92vw] space-y-2">
                <AnimatePresence>
                    {items.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: -12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ duration: 0.18 }}
                            className="pointer-events-auto rounded-2xl border border-white/15 bg-black/70 p-4 text-white shadow-xl backdrop-blur-xl"
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 text-white/90">
                                    {t.type === "success" ? (
                                        <CheckCircle2 size={18} />
                                    ) : t.type === "error" ? (
                                        <XCircle size={18} />
                                    ) : (
                                        <Info size={18} />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-semibold">{t.title}</div>
                                    {t.message ? (
                                        <div className="mt-0.5 text-xs text-white/70">{t.message}</div>
                                    ) : null}
                                </div>

                                <button
                                    className="rounded-xl p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
                                    onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
                                    aria-label="Close toast"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastCtx.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastCtx);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}