'use client'

import { useEnrollment } from '@/app/enrollment/context'

interface Step {
  id: number
  title: string
  shortTitle: string
}

const STEPS: Step[] = [
  { id: 1, title: 'Student Data', shortTitle: 'Student' },
  { id: 2, title: 'Family Data', shortTitle: 'Family' },
  { id: 3, title: 'Emergency', shortTitle: 'Emergency' },
  { id: 4, title: 'Education', shortTitle: 'Education' },
  { id: 5, title: 'Terms', shortTitle: 'Terms' },
  { id: 6, title: 'Submit', shortTitle: 'Submit' },
]

export function EnrollmentStepper() {
  const { currentStep } = useEnrollment()

  return (
    <div className="w-full bg-[#FDF8E8] overflow-x-auto">
      {/* Desktop: Ribbon-style stepper */}
      <nav aria-label="Progress" className="hidden md:block">
        <ol className="flex items-center h-14 lg:h-16 min-w-max">
          {/* Application Title Tab - Gold ribbon with diagonal cut */}
          <li className="relative flex items-center h-full">
            <div 
              className="h-full flex items-center pl-6 lg:pl-8 pr-8 lg:pr-10 bg-gold text-white font-semibold text-sm lg:text-base relative"
            >
              <span className="relative z-10">Application for Enrollment</span>
              {/* Diagonal cut */}
              <div 
                className="absolute right-0 top-0 h-full w-6 lg:w-8 bg-gold"
                style={{
                  clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
                }}
              />
              <div 
                className="absolute -right-[23px] lg:-right-[31px] top-0 h-full w-6 lg:w-8 bg-gold"
                style={{
                  clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                }}
              />
            </div>
          </li>

          {/* Step Tabs */}
          {STEPS.map((step) => {
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep
            const isLast = step.id === 6

            return (
              <li 
                key={step.id} 
                className="relative flex items-center h-full"
              >
                <div
                  className={`
                    h-full flex items-center transition-all duration-300 relative
                    ${isActive 
                      ? 'text-gold font-semibold' 
                      : isCompleted
                        ? 'text-gold/70 font-medium'
                        : 'text-ash font-medium'
                    }
                    ${isLast ? 'pl-4 lg:pl-6 pr-6 lg:pr-8' : 'pl-4 lg:pl-6 pr-8 lg:pr-10'}
                  `}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span className="text-sm lg:text-base whitespace-nowrap relative z-10">
                    {isActive ? (
                      <>{step.id}. {step.title}</>
                    ) : isLast ? (
                      step.title
                    ) : (
                      <>{step.id}.</>
                    )}
                  </span>
                  {/* Diagonal separator for non-last items */}
                  {!isLast && (
                    <>
                      <div 
                        className="absolute right-0 top-0 h-full w-6 lg:w-8 bg-[#FDF8E8]"
                        style={{
                          clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
                        }}
                      />
                      <div 
                        className="absolute -right-[23px] lg:-right-[31px] top-0 h-full w-6 lg:w-8 bg-[#FDF8E8]"
                        style={{
                          clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                        }}
                      />
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Mobile: Simplified ribbon stepper */}
      <nav aria-label="Progress" className="md:hidden">
        <ol className="flex items-center h-12 min-w-max">
          {/* Application Title Tab */}
          <li className="relative flex items-center h-full">
            <div 
              className="h-full flex items-center pl-4 pr-6 bg-gold text-white font-semibold text-xs relative"
            >
              <span className="relative z-10 truncate max-w-[120px]">Enrollment</span>
              <div 
                className="absolute right-0 top-0 h-full w-4 bg-gold"
                style={{
                  clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
                }}
              />
              <div 
                className="absolute -right-[15px] top-0 h-full w-4 bg-gold"
                style={{
                  clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                }}
              />
            </div>
          </li>

          {/* Active Step */}
          <li className="relative flex items-center h-full">
            <div className="h-full flex items-center pl-3 pr-6 text-gold font-semibold text-xs relative">
              <span className="whitespace-nowrap relative z-10">
                {currentStep}. {STEPS[currentStep - 1]?.shortTitle}
              </span>
              <div 
                className="absolute right-0 top-0 h-full w-4 bg-[#FDF8E8]"
                style={{
                  clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
                }}
              />
              <div 
                className="absolute -right-[15px] top-0 h-full w-4 bg-[#FDF8E8]"
                style={{
                  clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                }}
              />
            </div>
          </li>

          {/* Remaining Steps - Numbers only */}
          {STEPS.filter(s => s.id > currentStep && s.id < 6).map((step) => (
            <li key={step.id} className="relative flex items-center h-full">
              <div className="h-full flex items-center pl-3 pr-6 text-ash font-medium text-xs relative">
                <span className="relative z-10">{step.id}.</span>
                <div 
                  className="absolute right-0 top-0 h-full w-4 bg-[#FDF8E8]"
                  style={{
                    clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
                  }}
                />
                <div 
                  className="absolute -right-[15px] top-0 h-full w-4 bg-[#FDF8E8]"
                  style={{
                    clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                  }}
                />
              </div>
            </li>
          ))}

          {/* Submit */}
          <li className="relative flex items-center h-full">
            <div 
              className={`h-full flex items-center pl-3 pr-4 font-medium text-xs ${
                currentStep === 6 ? 'text-gold font-semibold' : 'text-charcoal'
              }`}
            >
              <span>Submit</span>
            </div>
          </li>
        </ol>
      </nav>
    </div>
  )
}
