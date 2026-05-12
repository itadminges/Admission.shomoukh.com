"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, LogIn, LayoutDashboard, FileText } from "lucide-react"
import { useUser, UserButton, useClerk, Show } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function EnrolmentHeader() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const access = useQuery(api.users.getAccess)
  const canAccessAdmin = access?.canAccessAdmin

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e4dc] bg-white/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div
        className="mx-auto flex min-h-[4.25rem] max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:min-h-[5rem] sm:px-6 sm:py-3 lg:px-8"
        style={{
          paddingLeft: "max(0.75rem, env(safe-area-inset-left, 0px))",
          paddingRight: "max(0.75rem, env(safe-area-inset-right, 0px))",
        }}
      >
        <Link href="/enrollment" className="flex min-w-0 items-center">
          <Image
            src="/Shomoukh-01.png"
            alt="Shomoukh Early Childhood Education"
            width={420}
            height={108}
            className="h-12 w-auto max-w-[min(82vw,420px)] object-contain sm:h-14 lg:h-16"
            priority
          />
        </Link>


        <div className="flex shrink-0 items-center gap-3 sm:gap-6">
          {canAccessAdmin && (
            <Link 
              href="/admin" 
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy/90 transition-all shadow-sm"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-gold" />
              Admin Panel
            </Link>
          )}

          <a
            href="tel:+96824567890"
            className="hidden min-w-0 items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--gold-dark)] sm:flex"
            aria-label="Call +968 2456 7890"
          >
            <Phone className="h-4 w-4 shrink-0 text-[var(--gold)]" />
            <span className="truncate">+968 2456 7890</span>
          </a>

          {user && (
            <Link 
              href="/dashboard" 
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 text-gold-dark text-xs font-bold hover:bg-gold/20 transition-all border border-gold/20"
            >
              <FileText className="w-3.5 h-3.5" />
              My Applications
            </Link>
          )}

          <div className="h-6 w-px bg-border-soft hidden sm:block" />

          <Show when="signed-in">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-navy hidden md:inline-block">
                {user?.fullName || user?.firstName || user?.username}
              </span>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                  }
                }}
              />
            </div>
          </Show>

          <Show when="signed-out">
            <Link 
              href="/sign-in" 
              className="flex items-center gap-2 text-sm font-bold text-navy hover:text-gold transition-colors"
            >
              <LogIn className="w-4 h-4 text-gold" />
              <span>Sign In</span>
            </Link>
          </Show>

          <a
            href="mailto:admissions@shomoukh.com"
            className="hidden xs:flex touch-manipulation rounded-full bg-[var(--navy)] px-5 py-2.5 text-sm font-semibold leading-none text-white shadow-sm transition-all hover:bg-[var(--gold)] hover:shadow-md"
          >
            Write to us
          </a>
        </div>
      </div>
    </header>
  )
}

