import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Logo } from "./Logo";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const session = await getServerSession(authOptions);
  const userName = (session as any)?.userName || session?.user?.name || "";

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-white">
          <Logo />
        </Link>

        <HeaderClient isAuthed={!!session} userName={userName} />
      </div>
    </header>
  );
}