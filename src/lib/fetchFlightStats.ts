export type FlightOpsStatsDto = {
    date: string;
    arrivalsToday: number;
    departuresToday: number;
    delayedToday: number;
    next60Count: number;
    activeGates: number;
};

export async function fetchFlightStats(date?: string) {
    const sp = new URLSearchParams();
    if (date) sp.set("date", date);

    const res = await fetch(`/api/flights/stats?${sp.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(await res.text());

    return (await res.json()) as FlightOpsStatsDto;
}