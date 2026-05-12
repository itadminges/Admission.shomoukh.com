"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { format } from "date-fns"
import { Clock, CheckCircle2, MessageSquare, ChevronRight, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function UserApplications() {
  const applications = useQuery(api.applications.listForUser)
  
  if (applications === undefined) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-slate-50/50">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <FileText size={32} />
          </div>
          <CardTitle className="text-navy mb-2">No Applications Found</CardTitle>
          <CardDescription className="max-w-xs">
            You haven't submitted any enrolment applications yet. Start a new one to see it here.
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif font-bold text-navy flex items-center gap-2">
        <Clock className="w-5 h-5 text-gold" />
        My Enrolment Status
      </h2>
      
      <div className="grid gap-4">
        {applications.map((app) => (
          <Card key={app._id} className="overflow-hidden hover:shadow-md transition-shadow border-border-soft rounded-2xl">
            <div className="flex flex-col md:flex-row">
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-gold bg-gold/5 px-2 py-1 rounded">
                    {app.referenceNumber}
                  </span>
                  {app.status === "accepted" ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1 border-none font-bold">
                      <CheckCircle2 size={12} /> Accepted
                    </Badge>
                  ) : app.status === "reviewing" ? (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1 border-none font-bold">
                      <Clock size={12} /> Reviewing
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1 border-none font-bold">
                      <Clock size={12} /> Pending Review
                    </Badge>
                  )}
                </div>
                
                <h3 className="font-bold text-navy text-lg">
                  {app.formData?.studentData?.givenNames} {app.formData?.studentData?.familyName}
                </h3>
                <p className="text-sm text-slate-500 mb-4 font-medium">
                  Submitted on {format(app.submittedAt, "MMMM d, yyyy")}
                </p>

                {/* Preview of latest message */}
                {app.comments && app.comments.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm italic text-slate-600">
                    <p className="line-clamp-1">"{app.comments[app.comments.length-1].text}"</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">— {app.comments[app.comments.length-1].author}</p>
                  </div>
                )}
              </div>
              
              <div className="bg-slate-50/50 p-6 md:w-56 flex flex-col justify-center items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100">
                <Link href={`/dashboard/application/${app._id}`} className="w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs font-bold gap-2 bg-white rounded-xl h-10 border-slate-200"
                  >
                    View Details <ChevronRight size={14} />
                  </Button>
                </Link>
                <Link href={`/dashboard/application/${app._id}`} className="w-full">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs font-bold gap-2 text-gold-dark hover:bg-gold/10 rounded-xl h-10"
                  >
                    <MessageSquare size={14} /> Message Admin
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
