import type { Board, FlightDto } from "@/types/flight";

export type FlightsFilters = {
    board: Board;
    search?: string;
    date?: string;
    delayedOnly?: boolean;
    status?: "all" | "active" | "inactive";
    terminal?: string;
    flightStatus?: string;
    airlineId?: number;
    gateId?: number;
};

export async function fetchFlights(filters: FlightsFilters) {
    const sp = new URLSearchParams();
    sp.set("board", filters.board);

    if (filters.search?.trim()) sp.set("search", filters.search.trim());
    if (filters.date) sp.set("date", filters.date);

    if (filters.delayedOnly) sp.set("delayedOnly", "true");

    if (filters.status && filters.status !== "all") sp.set("status", filters.status);

    if (filters.terminal?.trim()) sp.set("terminal", filters.terminal.trim());
    if (filters.flightStatus?.trim()) sp.set("flightStatus", filters.flightStatus.trim());

    if (typeof filters.airlineId === "number") sp.set("airlineId", String(filters.airlineId));
    if (typeof filters.gateId === "number") sp.set("gateId", String(filters.gateId));

    const res = await fetch(`/api/flights?${sp.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(await res.text());

    return (await res.json()) as FlightDto[];
}
