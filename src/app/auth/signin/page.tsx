import { Suspense } from "react";
import SignInClient from "@/components/auth/SigninClient";

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInSkeleton />}>
      <SignInClient />
    </Suspense>
  );
}

function SignInSkeleton() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="w-full rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl">
        <div className="h-7 w-28 rounded bg-white/10" />
        <div className="mt-2 h-4 w-56 rounded bg-white/10" />

        <div className="mt-6 space-y-3">
          <div className="h-12 w-full rounded-2xl bg-white/10" />
          <div className="h-12 w-full rounded-2xl bg-white/10" />
          <div className="h-12 w-full rounded-2xl bg-white/10" />
        </div>

        <div className="mt-4 h-4 w-40 rounded bg-white/10" />
      </div>
    </main>
  );
}