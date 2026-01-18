import "./globals.css";
import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import { AnimatedShell } from "@/components/AnimatedShell";

const SITE_NAME = "AeroPulse Airport";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `AeroPulse · Live Flights & Airport Operations`,
    template: `%s · AeroPulse`,
  },

  description:
    "Track live arrivals and departures, open verified flight details, and save favorites with a secure account — a premium flight board built for modern airport operations.",

  applicationName: 'AeroPulse',
  generator: "Next.js",
  referrer: "origin-when-cross-origin",

  keywords: [
    "airport",
    "flights",
    "arrivals",
    "departures",
    "flight tracker",
    "flight status",
    "airport operations",
    "favorites",
    "Prishtina",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `AeroPulse · Live Flights & Airport Operations`,
    description:
      "Live flight board with arrivals, departures, smart filters, and favorites — designed for speed and clarity.",
    siteName: 'AeroPulse',
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Live Flight Board`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `AeroPulse · Live Flights & Airport Operations`,
    description:
      "Track arrivals and departures in real time and save the flights you care about.",
    images: ["/airport-logo.png"],
  },

  icons: {
    icon: [{ url: "/airport-logo.png" }],
    apple: [{ url: "/airport-logo.png" }],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1220",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AnimatedShell>{children}</AnimatedShell>
        </Providers>
      </body>
    </html>
  );
}