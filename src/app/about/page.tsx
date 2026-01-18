import { Header } from "@/components/Header";

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className="mx-auto max-w-6xl px-4 py-10">
                <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl">
                    <h1 className="text-3xl font-semibold tracking-tight">About AeroPulse</h1>
                    <p className="mt-3 text-white/70 max-w-3xl">
                        AeroPulse is a demo “Airport Manager System” interface designed to feel like a modern
                        operations console: fast, elegant, and secure. It connects to an ASP.NET Identity backend,
                        supports session-based personalization, and lets users save flights to their favorites.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        {[
                            ["Real auth", "NextAuth sessions mapped to ASP.NET Identity tokens."],
                            ["Flight board", "Arrivals/departures split + search + status chips."],
                            ["Favorites", "Protected page + save/remove actions tied to user."],
                        ].map(([t, d]) => (
                            <div key={t} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                <div className="font-semibold">{t}</div>
                                <div className="mt-2 text-sm text-white/65">{d}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}