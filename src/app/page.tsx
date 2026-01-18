import { Header } from "@/components/Header";
import { HomeHero } from "@/components/home/HomeHero";
import { FlightsSection } from "@/components/home/FlightsSection";
import { Footer } from "@/components/Footer";

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
