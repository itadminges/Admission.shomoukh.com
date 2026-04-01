'use client'

import { useState } from 'react'
import { EnrollmentProvider } from '@/app/enrollment/context'
import { PremiumHeader } from './premium-header'
import { EnrollmentSidebar } from './enrollment-sidebar'
import { CircularStepper } from './circular-stepper'
import { EnrollmentStep1Premium } from './enrollment-step-1-premium'
import { EnrollmentStep2 } from './enrollment-step-2'
import { EnrollmentStep3 } from './enrollment-step-3'
import { EnrollmentStep4 } from './enrollment-step-4'
import { EnrollmentStep5 } from './enrollment-step-5'
import { EnrollmentStep6 } from './enrollment-step-6'

function EnrollmentFormContent() {
  const currentStep = 1 // This will come from context

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EnrollmentStep1Premium />
      case 2:
        return <EnrollmentStep2 />
      case 3:
        return <EnrollmentStep3 />
      case 4:
        return <EnrollmentStep4 />
      case 5:
        return <EnrollmentStep5 />
      case 6:
        return <EnrollmentStep6 />
      default:
        return <EnrollmentStep1Premium />
    }
  }

  return (
    <>
      <PremiumHeader />

      {/* Main Container */}
      <main className="min-h-screen bg-cream py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Sidebar - 1 column on lg */}
            <div className="lg:col-span-1 hidden lg:block">
              <EnrollmentSidebar />
            </div>

            {/* Right Form Panel - 2 columns on lg */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 md:p-10">
                {/* Circular Stepper */}
                <div className="mb-8 sm:mb-10">
                  <CircularStepper />
                </div>

                {/* Form Content */}
                <div className="animate-fade-in">
                  {renderStep()}
                </div>

                {/* Footer Info */}
                <div className="mt-10 sm:mt-12 pt-8 border-t border-border-light">
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-text-muted">
                    <div className="flex items-center gap-1">
                      <span>🔒</span>
                      <span>Your data is secure & private</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span>💾</span>
                      <span>Auto-saved as you go</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span>⚡</span>
                      <span>Quick & easy process</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span>📞</span>
                      <a href="tel:+96824567890" className="hover:text-gold transition-colors">
                        Need help? Call +968 2456 7890
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export function EnrollmentForm() {
  return (
    <EnrollmentProvider>
      <EnrollmentFormContent />
    </EnrollmentProvider>
  )
}
