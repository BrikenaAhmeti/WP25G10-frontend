import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { LogOut, Star } from "lucide-react";
import { Logo } from "./Logo";

export async function Header() {
  const session = await getServerSession(authOptions);
  const userName = (session as any)?.userName || session?.user?.name || "";

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-white">
          <Logo />
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link className="text-white/80 hover:text-white" href="/about">
            About
          </Link>

          <Link
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white/90 hover:bg-white/10"
            href="/favorites"
          >
            <Star size={16} /> Favorites
          </Link>

          {!session ? (
            <Link
              className="rounded-xl bg-white px-3 py-2 text-black hover:opacity-90"
              href="/auth/signin"
            >
              Sign in
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-white/70">
                Hi, <span className="text-white">{userName}</span>
              </span>

              <form action="/api/auth/signout" method="post">
                <button
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white/90 hover:bg-white/10"
                  type="submit"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </form>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}