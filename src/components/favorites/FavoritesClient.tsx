"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { FlightDto } from "@/types/flight";

function formatWhen(f: FlightDto) {
    const iso = f.departureDateTime ?? f.departureTime ?? f.arrivalDateTime ?? f.arrivalTime;
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString([], { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function FavoritesClient({ initial }: { initial: FlightDto[] }) {
    const safeInitial = Array.isArray(initial) ? initial : [];
    const [rows, setRows] = useState<FlightDto[]>(safeInitial);
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return rows;

        return rows.filter((f) => {
            const route = `${f.originAirport} ${f.destinationAirport}`.toLowerCase();
            return (
                f.flightNumber.toLowerCase().includes(s) ||
                (f.flightCode ?? "").toLowerCase().includes(s) ||
                f.airlineName.toLowerCase().includes(s) ||
                f.airlineCode.toLowerCase().includes(s) ||
                route.includes(s) ||
                f.status.toLowerCase().includes(s)
            );
        });
    }, [rows, q]);

    async function removeFavorite(flightId: string) {
        console.log(flightId, 'id here')
        const prev = rows;
        setRows((x) => x.filter((r) => r.id !== flightId));

        const res = await fetch(`/api/favorites/${encodeURIComponent(flightId)}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            setRows(prev);
            alert(await res.text().catch(() => "Failed to remove favorite"));
        }
    }

    return (
        <div>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search favorites (flight, airline, status, route)…"
                    className="w-full sm:max-w-md rounded-2xl border border-white/15 bg-black/20 px-4 py-3 outline-none placeholder:text-white/40"
                />
                <div className="text-sm text-white/60">
                    {filtered.length} / {rows.length}
                </div>
            </div>

            <div className="space-y-3">
                {filtered.map((f) => {
                    const route = `${f.originAirport} → ${f.destinationAirport}`;
                    const when = formatWhen(f);
                    const gate = `${f.gateTerminal ?? "-"}-${f.gateCode ?? "-"}`;
                    console.log(f, 'f')
                    return (
                        <div key={f.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <Link href={`/flights/${f.id}`} className="text-lg font-semibold hover:underline">
                                        {f.flightNumber}
                                    </Link>
                                    <div className="text-sm text-white/70">
                                        {f.airlineName} ({f.airlineCode})
                                    </div>

                                    <div className="mt-2 text-sm text-white/80">{route}</div>
                                    <div className="mt-1 text-xs text-white/60">
                                        {when} • {f.status} • Gate {gate}
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeFavorite(f.id)}
                                    className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })}

                {!rows.length && (
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center text-white/60">
                        No saved flights yet. Go to Home and click ⭐ on a flight.
                    </div>
                )}

                {!!rows.length && !filtered.length && (
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center text-white/60">
                        No matches for “{q}”.
                    </div>
                )}
            </div>
        </div>
    );
}