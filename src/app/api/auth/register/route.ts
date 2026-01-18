import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const backend = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backend) return NextResponse.json({ error: "Missing NEXT_PUBLIC_API_BASE_URL" }, { status: 500 });

    const body = await req.text();

    const res = await fetch(`${backend}/api/AuthApi/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        cache: "no-store",
    });

    const text = await res.text();
    return new NextResponse(text, {
        status: res.status,
        headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
    });
}