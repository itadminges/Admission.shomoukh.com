'use client'

import Link from 'next/link'
import { Phone, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PremiumHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-gold flex items-center justify-center border border-gold-dark">
              <BookOpen className="w-5 h-5 text-navy" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-lg font-semibold text-charcoal">SHOMOUKH</h1>
              <p className="text-xs text-text-muted">NURSERY</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#about" className="text-sm text-charcoal hover:text-gold transition-colors">
              About Us
            </a>
            <a href="#approach" className="text-sm text-charcoal hover:text-gold transition-colors">
              Our Approach
            </a>
            <a href="#admissions" className="text-sm text-charcoal hover:text-gold transition-colors">
              Admissions
            </a>
            <a href="#gallery" className="text-sm text-charcoal hover:text-gold transition-colors">
              Gallery
            </a>
            <a href="#news" className="text-sm text-charcoal hover:text-gold transition-colors">
              News & Events
            </a>
            <a href="#contact" className="text-sm text-charcoal hover:text-gold transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="tel:+96824567890" className="hidden sm:flex items-center gap-2 text-sm text-charcoal hover:text-gold transition-colors">
              <Phone className="w-4 h-4" />
              <span>+968 2456 7890</span>
            </a>
            <Link href="/book-visit">
              <Button
                variant="outline"
                className="hidden xs:inline-flex border-gold text-gold hover:bg-gold/5"
              >
                Book a School Visit
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-sm">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
