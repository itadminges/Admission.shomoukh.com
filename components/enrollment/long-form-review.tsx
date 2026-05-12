"use client"

import { forwardRef } from "react"
import Image from "next/image"
import type { EnrollmentFormData } from "@/lib/enrollment-types"
import { cn } from "@/lib/utils"

interface LongFormReviewProps {
  formData: EnrollmentFormData
  referenceNumber?: string
}

export const LongFormReview = forwardRef<HTMLDivElement, LongFormReviewProps>(
  ({ formData, referenceNumber }, ref) => {
    if (!formData) return null

    const studentData = formData.studentData || {} as any
    const familyData = formData.familyData || {} as any
    const emergencyData = formData.emergencyData || {} as any
    const educationalBackground = formData.educationalBackground || {} as any
    const conditionsWaiver = formData.conditionsWaiver || {} as any

    const Section = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
      <div className={cn("py-8 border-b border-border-soft last:border-0", className)}>
        <h3 className="text-lg font-bold text-navy mb-6 uppercase tracking-wider border-l-4 border-gold pl-4">
          {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {children}
        </div>
      </div>
    )

    const Field = ({ label, value, fullWidth }: { label: string; value: React.ReactNode; fullWidth?: boolean }) => (
      <div className={cn("flex flex-col gap-1.5", fullWidth ? "md:col-span-2" : "")}>
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
          {label}
        </span>
        <div className="text-sm font-medium text-navy min-h-[1.25rem]">
          {value || <span className="text-text-muted/40 italic">Not provided</span>}
        </div>
      </div>
    )

    return (
      <div 
        ref={ref} 
        className="bg-white p-8 sm:p-12 md:p-16 text-navy max-w-[1000px] mx-auto shadow-premium rounded-2xl"
        id="enrollment-long-form"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b-2 border-navy pb-10 mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-navy flex items-center justify-center text-white font-serif text-3xl font-bold rounded-xl">
                AS
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-navy uppercase">
                  Al Shomoukh International
                </h1>
                <p className="text-xs font-bold text-gold tracking-[0.3em] uppercase">
                  Private School
                </p>
              </div>
            </div>
            <div className="pt-4">
              <h2 className="text-3xl font-serif font-bold text-navy">
                Enrollment Application
              </h2>
              {referenceNumber && (
                <p className="text-sm font-mono text-gold-dark font-bold mt-2">
                  REF: {referenceNumber}
                </p>
              )}
            </div>
          </div>

          {studentData?.photoUrl && (
            <div className="relative w-40 h-48 rounded-xl overflow-hidden border-4 border-cream shadow-md">
              <Image 
                src={studentData.photoUrl} 
                alt="Student" 
                fill 
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Student Data Section */}
        <Section title="1. Student Information">
          <Field label="Family Name" value={studentData?.familyName} />
          <Field label="Given Names" value={studentData?.givenNames} />
          <Field label="Middle Name" value={studentData?.middleName} />
          <Field label="To Be Known As" value={studentData?.toBeKnownAs} />
          <Field label="Date of Birth" value={studentData?.dateOfBirth} />
          <Field label="Nationality" value={studentData?.nationality} />
          <Field label="Resident Card No." value={studentData?.omanResidentCardNumber} />
          <Field label="Gender" value={studentData?.gender} />
          <Field label="First Language" value={studentData?.firstLanguageSpoken} />
          <Field label="Other Languages" value={studentData?.otherLanguageSpoken} />
          <Field label="English Proficiency" value={studentData?.levelOfEnglishSpoken} />
          <Field label="Enrollment Year" value={studentData?.enrollmentYear} />
          <Field label="Grade Applied For" value={studentData?.anticipatedGradeOfEntry} />
        </Section>

        {/* Siblings Sub-section */}
        {studentData?.siblings && studentData.siblings.length > 0 && (
          <div className="py-8 border-b border-border-soft">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-6">Siblings Applied/Enrolled</h4>
            <div className="space-y-4">
              {studentData.siblings.map((sibling, idx) => (
                <div key={sibling.id || idx} className="grid grid-cols-3 gap-6 p-4 bg-cream/30 rounded-xl">
                  <Field label="Name" value={`${sibling.givenNames} ${sibling.familyName}`} />
                  <Field label="Age" value={sibling.age} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Family Data Section */}
        <Section title="2. Family Information">
          <Field label="Marital Status" value={familyData?.maritalStatus} />
          <Field label="Home Language" value={familyData?.languageSpokenAtHome} />
          <Field label="Custody Arrangement" value={familyData?.custodyArrangement} fullWidth />
          
          {familyData?.parents?.map((parent, idx) => (
            <div key={parent.id || idx} className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-8 border-t border-border-soft mt-6 first:border-0 first:mt-0 first:pt-0">
              <div className="md:col-span-2 flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  {parent.relationship} Information
                </h4>
                <div className="flex gap-4">
                  {parent.isEmergencyContact && (
                    <span className="text-[9px] font-bold bg-navy/5 text-navy px-2 py-1 rounded uppercase tracking-tighter">Emergency Contact</span>
                  )}
                  {parent.authorizedToPickup && (
                    <span className="text-[9px] font-bold bg-gold/10 text-gold-dark px-2 py-1 rounded uppercase tracking-tighter">Authorized Pickup</span>
                  )}
                </div>
              </div>
              <Field label="Full Name" value={`${parent.title} ${parent.givenNames} ${parent.familyName}`} />
              <Field label="Nationality" value={parent.nationality} />
              <Field label="Occupation" value={parent.occupation} />
              <Field label="Employer" value={parent.employer} />
              <Field label="Mobile Phone" value={parent.mobilePhone} />
              <Field label="Work Phone" value={parent.workPhone} />
              <Field label="Home Phone" value={parent.homePhone} />
              <Field label="Email Address" value={parent.email} />
              <Field label="Residential Address" value={parent.residentialAddress} fullWidth />
              <Field label="Postal Address" value={parent.postalAddress} fullWidth />
            </div>
          ))}
        </Section>

        {/* Emergency & Health Section */}
        <Section title="3. Emergency & Health">
          <Field label="Doctor's Name" value={emergencyData?.doctorName} />
          <Field label="Doctor's Phone" value={emergencyData?.doctorPhone} />
          <Field label="Preferred Hospital" value={emergencyData?.hospitalPreference} fullWidth />
          <Field label="Medical Conditions" value={emergencyData?.medicalConditions} fullWidth />
          <Field label="Allergies" value={emergencyData?.allergies} fullWidth />
          <Field label="Medications" value={emergencyData?.medications} fullWidth />
          <Field label="Additional Health Info" value={emergencyData?.additionalMedicalInfo} fullWidth />

          {emergencyData?.emergencyContacts?.map((contact, idx) => (
            <div key={contact.id || idx} className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-8 border-t border-border-soft mt-6">
              <div className="md:col-span-2 flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  Additional Emergency Contact {idx + 1}
                </h4>
                {contact.authorizedToPickup && (
                  <span className="text-[9px] font-bold bg-gold/10 text-gold-dark px-2 py-1 rounded uppercase tracking-tighter">Authorized Pickup</span>
                )}
              </div>
              <Field label="Full Name" value={contact.name} />
              <Field label="Relationship" value={contact.relationship} />
              <Field label="Mobile Phone" value={contact.mobilePhone} />
              <Field label="Email" value={contact.email} />
            </div>
          ))}
        </Section>

        {/* School History Section */}
        <Section title="4. Educational Background">
          {educationalBackground?.previousSchools && educationalBackground.previousSchools.length > 0 ? (
            educationalBackground.previousSchools.map((school, idx) => (
              <div key={school.id || idx} className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pb-6 border-b border-border-soft last:border-0 last:pb-0">
                <Field label="Previous School" value={school.schoolName} />
                <Field label="Country/City" value={`${school.country}, ${school.city}`} />
                <Field label="Years Attended" value={`${school.fromYear} - ${school.toYear}`} />
                <Field label="Grade Attended" value={school.gradeAttended} />
                <Field label="Reason for Leaving" value={school.reasonForLeaving} fullWidth />
              </div>
            ))
          ) : (
            <div className="md:col-span-2 text-sm text-text-muted italic">No previous school history provided.</div>
          )}

          <div className="md:col-span-2 space-y-6 pt-6">
            <Field 
              label="Learning Difficulties" 
              value={educationalBackground?.hasLearningDifficulties ? `Yes - ${educationalBackground.learningDifficultiesDetails}` : "No"} 
              fullWidth 
            />
            <Field 
              label="Special Support" 
              value={educationalBackground?.hasReceivedSpecialSupport ? `Yes - ${educationalBackground.specialSupportDetails}` : "No"} 
              fullWidth 
            />
            <Field label="Additional Info" value={educationalBackground?.additionalInfo} fullWidth />
          </div>
        </Section>

        {/* Policies & Signatures Section */}
        <Section title="5. Policies & Signatures">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded border border-gold flex items-center justify-center bg-gold/10">
                {conditionsWaiver?.agreeToTerms && "✓"}
              </div>
              <span className="text-sm font-medium">Agreed to Terms & Conditions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded border border-gold flex items-center justify-center bg-gold/10">
                {conditionsWaiver?.agreeToPhotoPolicy && "✓"}
              </div>
              <span className="text-sm font-medium">Agreed to Media/Photo Policy</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded border border-gold flex items-center justify-center bg-gold/10">
                {conditionsWaiver?.agreeToMedicalPolicy && "✓"}
              </div>
              <span className="text-sm font-medium">Agreed to Emergency Medical Care</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded border border-gold flex items-center justify-center bg-gold/10">
                {conditionsWaiver?.agreeToCodeOfConduct && "✓"}
              </div>
              <span className="text-sm font-medium">Agreed to Code of Conduct</span>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 mt-10 border-t-2 border-navy/10">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Parent/Guardian Signature</span>
              <div className="h-16 flex items-end border-b border-navy/40 pb-2">
                <span className="font-serif text-2xl text-navy italic">{conditionsWaiver?.parentSignatureName}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-navy/40">
                <span>FULL NAME</span>
                <span>DIGITALLY SIGNED</span>
              </div>
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Date of Signature</span>
              <div className="h-16 flex items-end border-b border-navy/40 pb-2">
                <span className="text-lg font-bold text-navy">{conditionsWaiver?.signatureDate}</span>
              </div>
              <div className="text-[10px] font-bold text-navy/40">
                <span>DATE (DD/MM/YYYY)</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-navy/10 text-center space-y-2">
          <p className="text-[10px] font-bold text-navy/40 tracking-widest uppercase">
            Al Shomoukh International Private School • Muscat, Oman
          </p>
          <p className="text-[10px] text-navy/30">
            This document is a formal enrollment application submitted via the online portal.
          </p>
        </div>
      </div>
    )
  }
)

LongFormReview.displayName = "LongFormReview"
