'use client'

import { Phone, Mail, Leaf } from 'lucide-react'
import Image from 'next/image'

export function EnrollmentSidebar() {
  return (
    <div className="h-full bg-gradient-to-b from-cream to-cream/50 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative leaf accent */}
      <div className="absolute top-0 right-0 opacity-5">
        <Leaf className="w-32 h-32 text-gold" />
      </div>
      <div className="absolute bottom-0 left-0 opacity-5">
        <Leaf className="w-24 h-24 text-gold rotate-180" />
      </div>

      <div className="relative z-10">
        {/* Main Title */}
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mb-4 leading-tight">
          Student
          <br />
          Enrolment
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-charcoal-light leading-relaxed mb-6">
          Begin your child&apos;s inspiring journey with Shomoukh Early Childhood Education, where learning blossoms through curiosity, creativity and care.
        </p>

        {/* Image */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
          <div className="relative w-full h-64 bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center">
            <Image
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop"
              alt="Children in classroom"
              width={400}
              height={300}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Help Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-border-light">
          <h3 className="font-semibold text-charcoal mb-3 text-sm">
            Need help with the application?
          </h3>
          <p className="text-xs text-text-muted mb-4">
            Our admissions team is here to help.
          </p>

          {/* Contact Info */}
          <div className="space-y-3">
            <a
              href="tel:+96824567890"
              className="flex items-center gap-3 p-3 rounded-lg bg-cream/50 hover:bg-gold/5 transition-colors group"
            >
              <Phone className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-charcoal">+968 2456 7890</span>
            </a>
            <a
              href="mailto:admissions@shomoukh.com"
              className="flex items-center gap-3 p-3 rounded-lg bg-cream/50 hover:bg-gold/5 transition-colors group"
            >
              <Mail className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-charcoal">admissions@shomoukh.com</span>
            </a>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 pt-6 border-t border-border-light space-y-2">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>Reggio Emilia Approach</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span>EYFS Curriculum</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Ages 2 - 6 Years</span>
          </div>
        </div>
      </div>
    </div>
  )
}
