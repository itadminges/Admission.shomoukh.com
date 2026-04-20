"use client"

import Link from "next/link"
import { Phone } from "lucide-react"

function TreeLogo() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-11 w-11 shrink-0"
      aria-hidden
    >
      <circle cx="24" cy="24" r="22" fill="rgba(200,162,77,0.12)" stroke="var(--gold)" strokeWidth="1.5" />
      <path
        fill="var(--gold)"
        d="M24 10c-1.5 3-5 5-5 9.5 0 3 2 5.5 5 7.5 3-2 5-4.5 5-7.5 0-4.5-3.5-6.5-5-9.5z"
      />
      <path
        fill="var(--gold-dark)"
        d="M24 26c-2 1.5-4 4-4 7h8c0-3-2-5.5-4-7z"
      />
      <rect x="21" y="31" width="6" height="8" rx="1" fill="var(--gold-dark)" />
    </svg>
  )
}

export function EnrolmentHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e4dc] bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:h-[4.5rem] sm:px-6 sm:py-0 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <TreeLogo />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-serif text-base font-semibold tracking-wide text-[var(--navy)] sm:text-lg">
              SHOMOUKH
            </p>
            <p className="truncate text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)] sm:text-[11px] sm:tracking-[0.2em]">
              Nursery
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {["About Us", "Our Approach", "Admissions", "Gallery", "News & Events", "Contact"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--gold-dark)]"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-5">
          <a
            href="tel:+96824567890"
            className="hidden items-center gap-2 text-sm text-[var(--text-secondary)] sm:flex"
          >
            <Phone className="h-4 w-4 text-[var(--gold)]" />
            <span>+968 2456 7890</span>
          </a>
          <a
            href="#contact"
            className="rounded-[10px] bg-[var(--gold)] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[var(--gold-dark)] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Enquire Now
          </a>
        </div>
      </div>
    </header>
  )
}
