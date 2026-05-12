"use client"

import { useState } from "react"
import { EnrollmentForm } from "@/components/enrollment-form-wrapper"
import { UserApplications } from "@/components/enrollment/user-applications"
import { EnrolmentHeader } from "@/components/enrollment/enrolment-header"
import { EnrolmentFooter } from "@/components/enrollment/enrolment-footer"
import { EnrolmentSidebar } from "@/components/enrollment/enrolment-sidebar"
import { Button } from "@/components/ui/button"
import { FileText, PlusCircle } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"

export default function EnrollmentPage() {
  const [view, setView] = useState<"new" | "mine">("new")
  const { data: session } = useSession()

  return (
    <div className="min-h-screen selection:bg-gold/20 flex flex-col">
      {/* If viewing new, the EnrollmentForm handles its own layout/header */}
      {view === "new" ? (
        <EnrollmentForm onSwitchToMyApps={() => setView("mine")} />
      ) : (
        <>
          <EnrolmentHeader />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-12 items-start">
              <aside className="space-y-6">
                <EnrolmentSidebar />
                <Button 
                  onClick={() => setView("new")}
                  className="w-full h-14 bg-navy hover:bg-navy/90 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all gap-3 font-bold"
                >
                  <PlusCircle className="w-5 h-5" />
                  New Enrolment
                </Button>
              </aside>

              <div className="space-y-8">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-serif font-bold text-navy">Admissions Portal</h1>
                  <div className="flex bg-white p-1 rounded-xl border border-border-soft shadow-sm">
                    <button 
                      onClick={() => setView("new")}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === "new" ? "bg-gold text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
                    >
                      New
                    </button>
                    <Link 
                      href="/dashboard"
                      className="px-4 py-2 rounded-lg text-sm font-bold transition-all text-slate-500 hover:bg-slate-50"
                    >
                      My Applications
                    </Link>
                  </div>
                </div>
                
                <UserApplications />
              </div>
            </div>
          </main>
          <EnrolmentFooter />
        </>
      )}
    </div>
  )
}
