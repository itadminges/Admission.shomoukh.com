"use client"

import { useParams, useRouter } from "next/navigation"
import { EnrolmentHeader } from "@/components/enrollment/enrolment-header"
import { EnrolmentFooter } from "@/components/enrollment/enrolment-footer"
import { ApplicationView } from "@/components/enrollment/application-view"
import { Button } from "@/components/ui/button"
import { ChevronLeft, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { Id } from "@/convex/_generated/dataModel"

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as Id<"applications">

  if (!id) return null

  return (
    <div className="min-h-screen selection:bg-gold/20 flex flex-col bg-slate-50/50">
      <EnrolmentHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 shadow-sm"
              onClick={() => router.back()}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-serif font-bold text-navy flex items-center gap-2">
                Application Details
              </h1>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                <Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link>
                <span>/</span>
                <span className="text-gold-dark">Details</span>
              </div>
            </div>
          </div>

          <Link href="/dashboard">
            <Button variant="ghost" className="text-navy font-bold gap-2 hover:bg-navy/5 rounded-xl">
              <LayoutDashboard size={18} />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="animate-fade-slide-up">
          <ApplicationView applicationId={id} />
        </div>
      </main>

      <EnrolmentFooter />
    </div>
  )
}
