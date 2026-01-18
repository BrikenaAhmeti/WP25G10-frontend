"use client";

import { useMemo, useState } from "react";
import { Clock, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchFlightStats } from "@/lib/fetchFlightStats";
import { FlightsBoard } from "@/components/FlightsBoard";
import { StatsStrip } from "@/components/home/StatsStrip";

type Focus = "all" | "next60" | "delayed";

function useNow() {
    const [now, setNow] = useState(() => new Date());
    useState(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    });
    return now;
}

export function FlightsSection() {
    const now = useNow();
    const [focus, setFocus] = useState<Focus>("all");

    const { data: stats, isFetching } = useQuery({
        queryKey: ["flight-stats"],
        queryFn: () => fetchFlightStats(),
        staleTime: 15_000,
        refetchInterval: 30_000,
    });

    const computed = useMemo(() => {
        const arrivals = stats?.arrivalsToday ?? 0;
        const departures = stats?.departuresToday ?? 0;
        const delayed = stats?.delayedToday ?? 0;
        const gates = stats?.activeGates ?? 0;
        const next60 = stats?.next60Count ?? 0;

        return {
            flightsToday: arrivals + departures,
            delayed,
            gates,
            arrivals,
            departures,
            next60,
        };
    }, [stats]);

    return (
        <section id="flights" className="pb-14">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div className="text-sm text-white/60">Operations</div>
                    <div className="text-2xl font-semibold tracking-tight">Flights</div>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/80">
                    <Clock size={16} className="text-white/60" />
                    <span className="font-mono">
                        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                    <span className="text-white/50">local</span>
                </div>
            </div>
            <StatsStrip computed={computed} isFetching={isFetching} />
            <div className="mb-4 mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 text-xs text-white/70">
                    <Filter size={14} /> Focus
                </span>

                {[
                    { k: "all", label: "All" },
                    { k: "next60", label: "Next 60 min" },
                    { k: "delayed", label: "Delayed" },
                ].map((x) => (
                    <button
                        key={x.k}
                        onClick={() => setFocus(x.k as Focus)}
                        className={`rounded-full px-3 py-2 text-xs ${focus === x.k
                                ? "bg-white text-black"
                                : "border border-white/15 bg-white/5 text-white/85 hover:bg-white/10"
                            }`}
                    >
                        {x.label}
                    </button>
                ))}
            </div>
            <FlightsBoard focus={focus} />
        </section>
    );
}