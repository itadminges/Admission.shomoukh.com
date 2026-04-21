"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"

export function EnrolmentHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e4dc] bg-white/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div
        className="mx-auto flex min-h-[4.25rem] max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:min-h-[5rem] sm:px-6 sm:py-3 lg:px-8"
        style={{
          paddingLeft: "max(0.75rem, env(safe-area-inset-left, 0px))",
          paddingRight: "max(0.75rem, env(safe-area-inset-right, 0px))",
        }}
      >
        <Link href="/" className="flex min-w-0 items-center">
          <Image
            src="/Shomoukh-01.png"
            alt="Shomoukh Early Childhood Education"
            width={420}
            height={108}
            className="h-12 w-auto max-w-[min(82vw,420px)] object-contain sm:h-14 lg:h-16"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Utility">
          <a
            href="https://shomoukh.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--gold-dark)]"
          >
            Main website
          </a>
          <a
            href="mailto:admissions@shomoukh.com"
            className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--gold-dark)]"
          >
            Email admissions
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-5">
          <a
            href="tel:+96824567890"
            className="hidden min-w-0 items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--gold-dark)] sm:flex"
            aria-label="Call +968 2456 7890"
          >
            <Phone className="h-4 w-4 shrink-0 text-[var(--gold)]" />
            <span className="truncate">+968 2456 7890</span>
          </a>
          <a
            href="mailto:admissions@shomoukh.com"
            className="touch-manipulation rounded-md bg-[var(--gold)] px-3 py-2.5 text-xs font-semibold leading-none text-white shadow-sm transition-colors hover:bg-[var(--gold-dark)] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Write to us
          </a>
        </div>
      </div>
    </header>
  )
}
