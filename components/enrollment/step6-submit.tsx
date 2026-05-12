"use client"

import { useRef } from "react"
import { CheckCircle2, Clock, Download, Mail, ArrowRight, Printer } from "lucide-react"
import type { EnrollmentFormData } from "@/lib/enrollment-types"
import { LongFormReview } from "./long-form-review"

interface Step6SubmitProps {
  formData:         EnrollmentFormData
  submitted:        boolean
  referenceNumber?: string
}

export function Step6Submit({ formData, submitted, referenceNumber }: Step6SubmitProps) {
  const studentData = formData?.studentData || {} as any
  const studentName = [studentData.givenNames, studentData.familyName].filter(Boolean).join(" ") || "the student"
  const longFormRef = useRef<HTMLDivElement>(null)

  const handleDownloadPDF = async () => {
    if (!longFormRef.current) return

    // Dynamically import html2pdf for client-side execution
    const html2pdf = (await import("html2pdf.js")).default
    
    const element = longFormRef.current
    const opt = {
      margin:       [10, 10],
      filename:     `Enrollment_${studentName.replace(/\s+/g, '_')}_${referenceNumber || 'Draft'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    // New Promise-based usage:
    html2pdf().set(opt).from(element).save()
  }

  /* ── SUCCESS STATE ── */
  if (submitted) {
    return (
      <div className="flex flex-col items-center space-y-8 px-1 py-12 text-center animate-fade-slide-up">
        <div className="relative shrink-0">
          <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gold/10 border-2 border-gold/30 shadow-lg shadow-gold/10">
            <CheckCircle2 className="h-16 w-16 text-gold" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-md border-2 border-white">
            <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
          </div>
        </div>

        <div className="max-w-xl space-y-3">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-navy">
            Application Submitted Successfully
          </h2>
          <p className="text-base text-text-secondary leading-relaxed">
            The enrollment form for <span className="font-bold text-navy">{studentName}</span> has been received. Our admissions team will review it and contact you within 3-5 working days.
          </p>
        </div>

        {referenceNumber && (
          <div className="w-full max-w-md rounded-2xl p-8 bg-gold/5 border-2 border-gold/20 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted mb-3">Your Application Reference</p>
            <p className="font-mono text-3xl font-bold tracking-widest text-gold-dark">{referenceNumber}</p>
            <p className="text-xs mt-3 text-text-muted/80">Please keep this number for future correspondence.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center pt-4">
          <button 
            type="button" 
            onClick={handleDownloadPDF}
            className="btn-gold h-12 px-8 flex items-center justify-center gap-2 group"
          >
            <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            Download Copy (PDF)
          </button>
          <button 
            type="button" 
            className="btn-ghost h-12 px-8 flex items-center justify-center gap-2 text-navy border-navy/10 hover:bg-navy/5"
          >
            <Mail className="w-4 h-4" />
            Email Summary
          </button>
        </div>

        {/* Hidden area for PDF generation */}
        <div className="hidden">
          <LongFormReview ref={longFormRef} formData={formData} referenceNumber={referenceNumber} />
        </div>

        <div className="pt-8 border-t border-border-soft w-full max-w-md flex flex-col items-center gap-4">
          <button
            onClick={() => window.location.href = "/enrollment"}
            className="text-sm font-bold text-navy hover:text-gold flex items-center justify-center gap-2 transition-colors px-6 py-3 rounded-xl bg-slate-50 border border-slate-200"
          >
            <Clock className="w-4 h-4 text-gold" />
            Go to My Applications Dashboard
          </button>
          
          <a
            href="https://shomoukh.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-gold hover:text-gold-dark flex items-center justify-center gap-2 transition-colors"
          >
            Return to School Website
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    )
  }

  /* ── REVIEW STATE ── */
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-soft pb-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-bold text-navy">
            Final Review
          </h2>
          <p className="text-base text-text-secondary leading-relaxed">
            Please review all information before submitting. You can go back to any section to make corrections.
          </p>
        </div>
        <button 
          type="button" 
          onClick={handleDownloadPDF}
          className="btn-ghost h-11 px-6 flex items-center gap-2 text-gold-dark border-gold/20 hover:bg-gold/5"
        >
          <Printer className="w-4 h-4" />
          Save as Draft PDF
        </button>
      </div>

      <div className="bg-cream/10 rounded-2xl shadow-inner-soft overflow-hidden border border-border-soft">
        <LongFormReview ref={longFormRef} formData={formData} referenceNumber={referenceNumber} />
      </div>

      <div className="bg-navy p-6 rounded-2xl text-white flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h4 className="text-sm font-bold mb-1">Declaration of Accuracy</h4>
          <p className="text-xs text-white/70 leading-relaxed">
            By clicking "Submit", I confirm that all the information provided above is correct to the best of my knowledge. I understand that any false information may lead to the cancellation of this application.
          </p>
        </div>
      </div>
    </div>
  )
}
