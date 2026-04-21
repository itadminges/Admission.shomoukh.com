"use client"

import Image from "next/image"
import { Mail, Phone } from "lucide-react"

export function EnrolmentSidebar() {
  return (
    <aside className="xl:sticky xl:top-28">
      <div
        className="overflow-hidden rounded-md border border-[#e5dfd4] bg-[#efe9df] p-5 shadow-sm sm:p-8"
        style={{ boxShadow: "0 8px 32px -12px rgba(15,18,38,.08)" }}
      >
        <h2 className="font-serif text-2xl font-bold leading-tight text-[var(--navy)]">
          Enrolment application
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:mt-4">
          Work through the steps in order, or jump back to anything you have already finished. Stuck on a field? Call or
          email — we answer during office hours.
        </p>

        <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-md border border-[#dfd6c8] bg-white shadow-inner">
          <Image
            src="/images/enrolment-mockup-hero.png"
            alt="Children learning at Shomoukh Nursery"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 340px"
            priority
          />
        </div>

        <div className="mt-5 rounded-md border border-[#e8e2d6] bg-white p-4 shadow-sm sm:mt-6 sm:p-5">
          <p className="text-sm font-semibold text-[var(--navy)]">Questions while you fill this in?</p>
          <div className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
            <a href="tel:+96824567890" className="flex items-center gap-2 transition-colors hover:text-[var(--gold-dark)]">
              <Phone className="h-4 w-4 shrink-0 text-[var(--gold)]" />
              +968 2456 7890
            </a>
            <a
              href="mailto:admissions@shomoukh.com"
              className="flex items-center gap-2 break-all transition-colors hover:text-[var(--gold-dark)]"
            >
              <Mail className="h-4 w-4 shrink-0 text-[var(--gold)]" />
              admissions@shomoukh.com
            </a>
          </div>
        </div>
      </div>
    </aside>
  )
}
