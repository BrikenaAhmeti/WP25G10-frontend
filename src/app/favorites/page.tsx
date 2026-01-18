import { Header } from "@/components/Header";
import FavoritesClient from "@/components/favorites/FavoritesClient";
import type { FlightDto } from "@/types/flight";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent("/favorites")}`);
  }

  const token = (session as any)?.accessToken as string | undefined;
  if (!token) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent("/favorites")}`);
  }

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

  const res = await fetch(`${base}/api/flightsApi/favorites`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 401) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent("/favorites")}`);
  }

  if (!res.ok) {
    throw new Error(await res.text().catch(() => `Failed: ${res.status}`));
  }

  const data = await res.json().catch(() => []);
  const favorites: FlightDto[] = Array.isArray(data) ? data : [];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl">
          <h1 className="text-2xl font-semibold tracking-tight">Your Favorites</h1>
          <p className="mt-1 text-sm text-white/60">Saved flights tied to your account.</p>

          <div className="mt-6">
            <FavoritesClient initial={favorites} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}