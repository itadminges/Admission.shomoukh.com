"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signIn, useSession } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, isPending } = useSession();
  
  // Redirect if already logged in
  useEffect(() => {
    if (session && !isPending) {
      const redirectTo = new URLSearchParams(window.location.search).get("redirect");
      router.push(redirectTo || "/enrollment");
    }
  }, [session, isPending, router]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.email && formData.password) {
      const { data, error } = await signIn.email({ 
        email: formData.email, 
        password: formData.password 
      });

      if (error) {
        toast.error("Sign in failed", {
          description: error.message || "Please check your email and password.",
        });
      } else {
        toast.success("Welcome back!", {
          description: "You have successfully signed in.",
        });
        
        // Check if we were redirected here from a submission attempt
        const redirectTo = new URLSearchParams(window.location.search).get("redirect");
        router.push(redirectTo || "/enrollment"); 
      }
    } else {
      toast.error("Invalid credentials", {
        description: "Please check your email and password.",
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
        <div className="mb-10 text-center">
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
              User Login
            </h1>
            <p className="mt-3 text-[var(--text-muted)] text-sm font-medium">
              Enter your credentials to access the enrollment portal
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="premium-card p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="name@shomoukh.com"
                  className="input-premium w-full pl-10 py-3 text-sm placeholder:text-[var(--text-muted)]/50"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label 
                  htmlFor="password" 
                  className="text-xs font-bold uppercase tracking-widest text-[var(--navy)]/70"
                >
                  Password
                </label>
                <button 
                  type="button" 
                  className="text-xs font-semibold text-[var(--gold)] hover:text-[var(--gold-dark)] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
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
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2 px-1">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-border-mid text-[var(--gold)] focus:ring-[var(--gold)]/20 cursor-pointer"
              />
              <label 
                htmlFor="remember" 
                className="text-sm font-medium text-[var(--text-secondary)] cursor-pointer select-none"
              >
                Keep me signed in
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold w-full py-4 flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">Sign in to Portal</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 relative z-10" />
                </>
              )}
            </button>
            
            {/* Test Data Button */}
            <button
              type="button"
              onClick={() => {
                setFormData({ email: "test@example.com", password: "password123" });
              }}
              className="btn-ghost w-full py-2 flex items-center justify-center gap-2 text-sm text-navy mt-2 border border-navy/10 hover:bg-navy/5"
            >
              Use Test Account
            </button>
          </form>


        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
          Don't have an account?{" "}
          <Link 
            href="/signup" 
            className="font-semibold text-[var(--navy)] hover:text-[var(--gold)] underline decoration-[var(--gold)]/30 underline-offset-4 transition-colors"
          >
            Sign up here
          </Link>
        </p>
        
        <div className="mt-8 pt-8 border-t border-[var(--navy)]/5 text-center">
          <Link 
            href="/enrollment" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--navy)] transition-colors"
          >
            <span>← Return to Admissions Form</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

