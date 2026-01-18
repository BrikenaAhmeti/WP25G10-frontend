import Link from "next/link";

export function Footer() {
    return (
        <footer className="mt-8 border-t border-white/10 bg-black/20 backdrop-blur-xl">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid gap-6 md:grid-cols-3">
                    <div>
                        <div className="text-lg font-semibold">AeroPulse</div>
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-white/80">Explore</div>
                        <div className="mt-3 space-y-2 text-sm">
                            <Link className="block text-white/65 hover:text-white" href="/">
                                Home
                            </Link>
                            <Link className="block text-white/65 hover:text-white" href="/about">
                                About
                            </Link>
                            <Link className="block text-white/65 hover:text-white" href="/favorites">
                                Favorites
                            </Link>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-white/80">Notes</div>
                        <div className="mt-3 space-y-2 text-sm text-white/65">
                            <div className="text-white/45">© {new Date().getFullYear()} AeroPulse</div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}