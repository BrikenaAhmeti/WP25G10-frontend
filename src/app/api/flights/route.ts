import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const qs = url.searchParams.toString();

    const backend = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log(backend, 'backend')
    if (!backend) {
        return NextResponse.json({ error: "Missing BACKEND_URL" }, { status: 500 });
    }

    const res = await fetch(`${backend}/api/FlightsApi?${qs}`, { cache: "no-store" });

    const text = await res.text();
    return new NextResponse(text, {
        status: res.status,
        headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
    });
}
