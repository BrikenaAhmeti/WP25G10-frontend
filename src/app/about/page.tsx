import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className="mx-auto max-w-6xl px-4 py-10">
                <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl">
                    <h1 className="text-3xl font-semibold tracking-tight">About AeroPulse</h1>
                    <p className="mt-3 text-white/70 max-w-3xl">
                        AeroPulse is a modern airport concept based in Prishtina, created with the vision of connecting people, cities, and opportunities through safe, efficient, and innovative air travel.
                    </p>
                    <p className="mt-3 text-white/70 max-w-3xl">
                        Our focus is on delivering a smooth airport experience — from arrival to departure — by combining smart technology, dedicated staff, and passenger-first services. At AeroPulse, we believe that every journey should begin with comfort, clarity, and confidence.
                    </p>
                    <p className="mt-3 text-white/70 max-w-3xl">
                        Positioned in the heart of Kosovo, AeroPulse aims to become a regional gateway that supports tourism, business growth, and international connectivity. We are committed to continuous improvement, sustainability, and building strong partnerships that shape the future of aviation in the region.
                    </p>
                    <p className="mt-3 text-white/70 max-w-3xl italic">
                        AeroPulse — where every flight starts with momentum.
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        {[
                            ["Smart Security", "Fast and reliable passenger screening designed for smooth airport flow."],
                            ["Live Flight Board", "Real-time arrivals and departures with clear status updates."],
                            ["Passenger Services", "Easy access to lounges, assistance, and travel information."],
                        ].map(([t, d]) => (
                            <div key={t} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                <div className="font-semibold">{t}</div>
                                <div className="mt-2 text-sm text-white/65">{d}</div>
                            </div>
                        ))}
                    </div>

                </div>
            </main>
            <Footer/>
        </>
    );
}