"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, LogIn, User, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function EnrolmentHeader() {
  const { user, logout } = useAuth()

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


        <div className="flex shrink-0 items-center gap-3 sm:gap-6">
          <a
            href="tel:+96824567890"
            className="hidden min-w-0 items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--gold-dark)] sm:flex"
            aria-label="Call +968 2456 7890"
          >
            <Phone className="h-4 w-4 shrink-0 text-[var(--gold)]" />
            <span className="truncate">+968 2456 7890</span>
          </a>

          <div className="h-6 w-px bg-border-soft hidden sm:block" />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream border border-gold/20 hover:bg-gold/5 transition-colors cursor-pointer group">
                  <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-semibold text-navy hidden md:inline-block">
                    {user.name}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel className="font-serif">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs text-text-muted py-2">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center gap-2 text-sm font-bold text-navy hover:text-gold transition-colors"
            >
              <LogIn className="w-4 h-4 text-gold" />
              <span>Sign In</span>
            </Link>
          )}

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

