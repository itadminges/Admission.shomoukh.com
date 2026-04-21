import Link from "next/link";

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
            Account registration was removed from this deployment.
          </p>
        </div>
        <p className="rounded-md border border-white/15 bg-white/5 px-4 py-3 text-center text-sm text-white/75">
          Staff signup is currently disabled.
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
