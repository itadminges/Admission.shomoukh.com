'use client'

import { useEnrollment } from '@/app/enrollment/context'

const STEPS = [
  { number: 1, label: 'Student Profile', description: 'Basic information' },
  { number: 2, label: 'Family Details', description: 'Parents & guardians' },
  { number: 3, label: 'Emergency Contact', description: 'Who to contact' },
  { number: 4, label: 'Learning Background', description: 'Previous experience' },
  { number: 5, label: 'Documents', description: 'Upload files' },
  { number: 6, label: 'Review & Submit', description: 'Confirm & send' },
]

export function CircularStepper() {
  const { currentStep } = useEnrollment()

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4 px-2 sm:px-4 py-6 md:py-8">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Circle and line */}
            <div className="flex flex-col items-center gap-2">
              {/* Step Circle */}
              <div
                className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-semibold text-sm md:text-base font-serif transition-all duration-300 ${
                  currentStep > step.number
                    ? 'bg-gold text-white'
                    : currentStep === step.number
                      ? 'bg-gold text-white ring-4 ring-gold/20'
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                <span className="font-serif font-bold">{step.number}</span>
              </div>

              {/* Labels */}
              <div className="text-center">
                <p
                  className={`text-[10px] sm:text-xs md:text-sm font-semibold transition-colors ${
                    currentStep >= step.number ? 'text-gold' : 'text-gray-600'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[8px] sm:text-[10px] text-gray-500 hidden md:block">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connecting Line */}
            {index < STEPS.length - 1 && (
              <div
                className={`flex-1 h-1 mx-1 sm:mx-2 md:mx-3 transition-colors ${
                  currentStep > step.number ? 'bg-gold' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
