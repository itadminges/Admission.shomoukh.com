"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: nextUrl.startsWith("/") ? nextUrl : "/admin",
      });
      if (result.error) {
        setError(result.error.message ?? "Could not sign in.");
        setPending(false);
        return;
      }
      router.push(nextUrl.startsWith("/") ? nextUrl : "/admin");
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
        <label htmlFor="email" className="mb-1 block text-xs font-medium text-white/70">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-white/15 bg-[#1E1E2E] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#C9A84C]/60 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/40"
          placeholder="you@school.om"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-xs font-medium text-white/70">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-white/15 bg-[#1E1E2E] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#C9A84C]/60 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/40"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-[#C9A84C] py-2.5 text-sm font-semibold text-[#1E1E2E] transition hover:bg-[#d9b85c] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
