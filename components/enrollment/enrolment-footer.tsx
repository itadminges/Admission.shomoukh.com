"use client"

import Image from "next/image"
import Link from "next/link"
import { Mail, Phone } from "lucide-react"

export function EnrolmentFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-14 border-t border-[var(--border-soft)] bg-gradient-to-b from-[#fdfcf8]/90 to-[#f0ebe3]/40 sm:mt-16">
      <div
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
        style={{
          paddingBottom: "max(2.5rem, env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="flex max-w-lg flex-col items-center text-center md:items-start md:text-left">
            <Link href="/" className="inline-flex shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2">
              <Image
                src="/Shomoukh-01.png"
                alt="Shomoukh Early Childhood Education"
                width={440}
                height={113}
                className="h-14 w-auto object-contain sm:h-16 md:h-[4.5rem]"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              For admissions, fees, or tour requests, reach us on the details opposite — we reply as soon as we can during
              the working week.
            </p>
          </div>

          <div
            className="w-full max-w-sm rounded-md border border-[var(--border-soft)] bg-white/80 px-5 py-5 shadow-sm backdrop-blur-sm md:w-auto md:min-w-[280px]"
            style={{ boxShadow: "0 8px 28px -12px rgba(15,18,38,.08)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="tel:+96824567890"
                  className="flex items-center gap-3 text-[var(--text-secondary)] transition-colors hover:text-[var(--gold-dark)]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[rgba(200,162,77,.12)]">
                    <Phone className="h-4 w-4 text-[var(--gold)]" aria-hidden />
                  </span>
                  +968 2456 7890
                </a>
              </li>
              <li>
                <a
                  href="mailto:admissions@shomoukh.com"
                  className="flex items-start gap-3 break-all text-[var(--text-secondary)] transition-colors hover:text-[var(--gold-dark)]"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[rgba(200,162,77,.12)]">
                    <Mail className="h-4 w-4 text-[var(--gold)]" aria-hidden />
                  </span>
                  admissions@shomoukh.com
                </a>
              </li>
              <li>
                <a
                  href="https://shomoukh.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-[var(--gold-dark)] underline-offset-4 hover:underline"
                >
                  shomoukh.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-[var(--border-soft)] pt-8 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            © {year} Shomoukh Early Childhood Education. All rights reserved.
          </p>
          <p className="text-[11px] text-[var(--text-muted)]/90">
            This form is for enrolment only. What you send here is used for admission and safeguarding, in line with our
            privacy notice.
          </p>
        </div>
      </div>
    </footer>
  )
}
