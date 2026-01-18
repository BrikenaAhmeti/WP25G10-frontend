import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

function backendBase() {
  const b = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!b) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  return b.replace(/\/$/, "");
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> | { id: string } }
) {
  const p = await Promise.resolve(ctx.params);
  const id = p?.id;

  console.log(p, "here params");

  if (!id) {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const token = (session as any)?.accessToken as string | undefined;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    `${backendBase()}/api/flightsApi/${encodeURIComponent(id)}/favorite`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (res.status === 204) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json(
      { message: text || "Failed to remove favorite" },
      { status: res.status }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}