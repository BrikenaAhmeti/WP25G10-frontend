import "./globals.css";
import Providers from "./providers";
import { AnimatedShell } from "@/components/AnimatedShell";

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
