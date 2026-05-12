"use client"

import { EnrolmentHeader } from "@/components/enrollment/enrolment-header"
import { EnrolmentFooter } from "@/components/enrollment/enrolment-footer"
import { EnrolmentSidebar } from "@/components/enrollment/enrolment-sidebar"
import { UserApplications } from "@/components/enrollment/user-applications"
import { Button } from "@/components/ui/button"
import { PlusCircle, LayoutDashboard } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen selection:bg-gold/20 flex flex-col bg-slate-50/50">
      <EnrolmentHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-start">
          {/* Left Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <EnrolmentSidebar />
            <Link href="/enrollment">
              <Button 
                className="w-full h-14 bg-navy hover:bg-navy/90 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all gap-3 font-bold"
              >
                <PlusCircle className="w-5 h-5 text-gold" />
                New Enrolment
              </Button>
            </Link>
          </aside>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-serif font-bold text-navy flex items-center gap-3">
                  <LayoutDashboard className="w-8 h-8 text-gold" />
                  Parent Dashboard
                </h1>
                <p className="text-slate-500 mt-1 font-medium">Manage your children's applications and messages</p>
              </div>
              
              <div className="flex bg-white p-1 rounded-xl border border-border-soft shadow-sm self-start">
                <Link 
                  href="/enrollment"
                  className="px-4 py-2 rounded-lg text-sm font-bold transition-all text-slate-500 hover:bg-slate-50"
                >
                  New Application
                </Link>
                <div className="px-4 py-2 rounded-lg text-sm font-bold transition-all bg-gold text-white shadow-sm">
                  My Applications
                </div>
              </div>
            </div>
            
            <div className="animate-fade-slide-up">
              <UserApplications />
            </div>
          </div>
        </div>
      </main>

      <EnrolmentFooter />
    </div>
  )
}
