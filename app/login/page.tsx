import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Staff sign in | Shomoukh Admissions",
};

function LoginFormFallback() {
  return (
    <div className="h-40 animate-pulse rounded-md bg-white/5" aria-hidden />
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#1E1E2E] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#252536] p-8 shadow-xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A84C]">
            Shomoukh Admissions
          </p>
          <h1 className="mt-2 font-serif text-2xl font-semibold text-white">Sign in</h1>
          <p className="mt-2 text-sm text-white/60">
            Access the internal applications dashboard. Parents use the public enrolment form on the home page.
          </p>
        </div>
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-white/50">
          No account yet?{" "}
          <Link href="/signup" className="text-[#C9A84C] hover:underline">
            Create one
          </Link>
        </p>
        <p className="mt-4 text-center text-xs text-white/40">
          <Link href="/" className="hover:text-white/60">
            ← Back to enrolment form
          </Link>
        </p>
      </div>
    </div>
  );
}
