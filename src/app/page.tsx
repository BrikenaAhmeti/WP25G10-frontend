import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { HomeHero } from "@/components/home/HomeHero";
import { FlightsSection } from "@/components/home/FlightsSection";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Home",
  description:
    "View live arrivals and departures, open flight details, and save favorites — a premium flight experience built for clarity and speed.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4">
        <HomeHero />
        <FlightsSection />
      </main>
      <Footer />
    </>
  );
}