"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: "/admin",
      });
      if (result.error) {
        setError(result.error.message ?? "Could not create account.");
        setPending(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="mb-1 block text-xs font-medium text-white/70">
          Full name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-white/15 bg-[#1E1E2E] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#C9A84C]/60 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/40"
        />
      </div>
      <div>
        <label htmlFor="signup-email" className="mb-1 block text-xs font-medium text-white/70">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-white/15 bg-[#1E1E2E] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#C9A84C]/60 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/40"
        />
      </div>
      <div>
        <label htmlFor="signup-password" className="mb-1 block text-xs font-medium text-white/70">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-white/15 bg-[#1E1E2E] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#C9A84C]/60 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/40"
        />
        <p className="mt-1 text-xs text-white/40">At least 8 characters.</p>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-[#C9A84C] py-2.5 text-sm font-semibold text-[#1E1E2E] transition hover:bg-[#d9b85c] disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
