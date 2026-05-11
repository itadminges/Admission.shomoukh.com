"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.name && formData.email && formData.password) {
      const { data, error } = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      if (error) {
        toast.error("Registration failed", {
          description: error.message || "Please check your details and try again.",
        });
      } else {
        toast.success("Account created successfully!", {
          description: "Welcome to Shomoukh Admissions.",
        });
        router.push("/enrollment"); 
      }
    } else {
      toast.error("Registration failed", {
        description: "Please fill in all required fields correctly.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col items-center justify-center p-4 selection:bg-[var(--gold)]/20">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[var(--gold)]/5 blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[var(--navy)]/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-slide-up">
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block transition-transform hover:scale-105 duration-300">
            <Image
              src="/Shomoukh-01.png"
              alt="Shomoukh International Investment"
              width={180}
              height={60}
              className="mx-auto"
              priority
            />
          </Link>
          <div className="mt-8">
            <h1 className="text-3xl font-serif font-semibold text-[var(--navy)] tracking-tight">
              Create Account
            </h1>
            <p className="mt-3 text-[var(--text-muted)] text-sm font-medium">
              Join our portal to manage your school applications
            </p>
          </div>
        </div>

        {/* Signup Card */}
        <div className="premium-card p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label 
                htmlFor="name" 
                className="text-xs font-bold uppercase tracking-widest text-[var(--navy)]/70 ml-1"
              >
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--gold)] transition-colors">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="input-premium w-full pl-10 py-3 text-sm placeholder:text-[var(--text-muted)]/50"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="text-xs font-bold uppercase tracking-widest text-[var(--navy)]/70 ml-1"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--gold)] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="input-premium w-full pl-10 py-3 text-sm placeholder:text-[var(--text-muted)]/50"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="text-xs font-bold uppercase tracking-widest text-[var(--navy)]/70 ml-1"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--gold)] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="input-premium w-full pl-10 pr-10 py-3 text-sm placeholder:text-[var(--text-muted)]/50"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--navy)] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] px-1">
                Must be at least 8 characters with a mix of letters and numbers.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold w-full py-4 mt-2 flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">Create Your Account</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 relative z-10" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="font-semibold text-[var(--navy)] hover:text-[var(--gold)] underline decoration-[var(--gold)]/30 underline-offset-4 transition-colors"
          >
            Sign in here
          </Link>
        </p>
        
        <div className="mt-8 pt-8 border-t border-[var(--navy)]/5 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--navy)] transition-colors"
          >
            <span>← Return to Admissions Form</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

