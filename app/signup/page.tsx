import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata = {
  title: "Create account | Shomoukh Admissions",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#1E1E2E] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#252536] p-8 shadow-xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A84C]">
            Shomoukh Admissions
          </p>
          <h1 className="mt-2 font-serif text-2xl font-semibold text-white">Create account</h1>
          <p className="mt-2 text-sm text-white/60">
            Staff accounts for the dashboard. Ask IT to add your email to admin allowlist or grant a role after signup.
          </p>
        </div>
        <SignupForm />
        <p className="mt-6 text-center text-sm text-white/50">
          Already registered?{" "}
          <Link href="/login" className="text-[#C9A84C] hover:underline">
            Sign in
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
