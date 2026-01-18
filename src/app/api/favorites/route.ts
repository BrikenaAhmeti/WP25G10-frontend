import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { FlightDto } from "@/types/flight";

function backendBase() {
    const b = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!b) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
    return b.replace(/\/$/, "");
}

function normalizeFlight(x: any): FlightDto {
    const depIso = x?.departureDateTime ?? x?.departureTime ?? null;
    const arrIso = x?.arrivalDateTime ?? x?.arrivalTime ?? null;

    return {
        id: String(x?.id ?? x?.Id ?? ""),
        flightNumber: String(x?.flightNumber ?? x?.FlightNumber ?? ""),
        flightCode: String(
            x?.flightCode ?? x?.FlightCode ?? x?.flightNumber ?? x?.FlightNumber ?? ""
        ),
        airlineName: String(x?.airlineName ?? x?.AirlineName ?? ""),
        airlineCode: String(x?.airlineCode ?? x?.AirlineCode ?? ""),
        originAirport: String(x?.originAirport ?? x?.OriginAirport ?? ""),
        destinationAirport: String(x?.destinationAirport ?? x?.DestinationAirport ?? ""),
        departureDateTime: depIso ? String(depIso) : undefined,
        arrivalDateTime: arrIso ? String(arrIso) : undefined,
        departureTime: depIso ? String(depIso) : undefined,
        arrivalTime: arrIso ? String(arrIso) : undefined,
        gateTerminal: (x?.gateTerminal ?? x?.GateTerminal ?? undefined) ?? undefined,
        gateCode: (x?.gateCode ?? x?.GateCode ?? undefined) ?? undefined,
        status: String(x?.status ?? x?.Status ?? ""),
    };
}

export async function GET() {
    const session = await getServerSession(authOptions);
    const token = (session as any)?.accessToken as string | undefined;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const res = await fetch(`${backendBase()}/api/flightsApi/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        return NextResponse.json(
            { message: text || "Failed to load favorites" },
            { status: res.status }
        );
    }

    const raw = await res.json().catch(() => []);
    const list = Array.isArray(raw) ? raw.map(normalizeFlight) : [];
    return NextResponse.json(list);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const token = (session as any)?.accessToken as string | undefined;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const flightId = body?.flightId;

    if (flightId === undefined || flightId === null || String(flightId).trim() === "") {
        return NextResponse.json({ message: "Missing flightId" }, { status: 400 });
    }

    const res = await fetch(
        `${backendBase()}/api/flightsApi/${encodeURIComponent(String(flightId))}/favorite`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        }
    );

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        return NextResponse.json(
            { message: text || "Failed to save favorite" },
            { status: res.status }
        );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
}