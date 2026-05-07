import { Mail, Phone, CheckCircle, Star, Quote, Clock, ShieldCheck } from "lucide-react"

export function EnrolmentSidebar() {
  return (
    <aside className="xl:sticky xl:top-8 space-y-6">
      {/* Main Info Card */}
      <div className="premium-card p-6 sm:p-8 bg-gradient-to-br from-white to-cream/30">
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <h2 className="font-serif text-2xl font-bold leading-tight text-navy">
              Enrolment Application
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              Complete your application to join our vibrant learning community. Your progress is saved automatically.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Admission Steps
            </h3>
            <div className="space-y-3">
              {[
                "Submit Online Application",
                "Review of Documents",
                "Placement Assessment",
                "Final Enrollment Offer"
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/10 text-[10px] font-bold text-gold group-hover:bg-gold group-hover:text-white transition-colors duration-300">
                    {i + 1}
                  </div>
                  <span className="text-sm text-text-secondary group-hover:text-navy transition-colors">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-navy text-white space-y-4">
            <p className="text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold" />
              Need Assistance?
            </p>
            <div className="space-y-3">
              <a href="tel:+96824567890" className="flex items-center gap-3 text-xs text-white/80 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                +968 2456 7890
              </a>
              <a href="mailto:admissions@shomoukh.com" className="flex items-center gap-3 text-xs text-white/80 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                admissions@shomoukh.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Card */}
      <div className="premium-card p-6 bg-white border-gold/10">
        <h3 className="text-sm font-bold text-navy mb-4">Why Al Shomoukh?</h3>
        <div className="space-y-4">
          {[
            { title: "International Standards", desc: "British & Omani curriculum excellence" },
            { title: "Expert Educators", desc: "Qualified international teaching staff" },
            { title: "Modern Facilities", desc: "State-of-the-art learning environments" }
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <Star className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-navy">{item.title}</p>
                <p className="text-[11px] text-text-muted mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Small Testimonial */}
      <div className="premium-card p-6 bg-gold/5 border-gold/5 relative overflow-hidden">
        <Quote className="absolute -top-2 -left-2 w-12 h-12 text-gold/10" />
        <div className="relative z-10">
          <p className="text-xs italic text-text-secondary leading-relaxed">
            "The admission process was smooth and the staff was incredibly helpful throughout our transition."
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gold/20" />
            <span className="text-[10px] font-bold text-navy">Parent of Grade 2 Student</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
