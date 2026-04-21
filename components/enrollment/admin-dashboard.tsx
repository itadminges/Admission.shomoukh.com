"use client"

import Link from "next/link"
export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold text-foreground">Admin dashboard unavailable</h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Convex and Better Auth were removed from this project, so the previous admin features are disabled.
          The public enrolment form remains available.
        </p>
        <Link
          href="/"
          className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted/40"
        >
          Go to public form
        </Link>
      </main>
    </div>
  )
}
