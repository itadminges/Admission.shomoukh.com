"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Dummy logic: any non-empty fields "log in"
    if (formData.email && formData.password) {
      login(formData.email, formData.email.split('@')[0]);
      toast.success("Welcome back!", {
        description: "You have successfully signed in.",
      });
      
      // Check if we were redirected here from a submission attempt
      const redirectTo = new URLSearchParams(window.location.search).get("redirect");
      router.push(redirectTo || "/enrollment"); 
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
              Staff Portal
            </h1>
            <p className="mt-3 text-[var(--text-muted)] text-sm font-medium">
              Enter your credentials to access the admissions dashboard
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
                  <span className="relative z-10">Sign in to Dashboard</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 relative z-10" />
                </>
              )}
            </button>
          </form>

          {/* Alternative Options */}
          <div className="mt-8 space-y-4">
            <div className="section-divider">or continue with</div>
            
            <div className="grid grid-cols-1 gap-3">
              <button className="btn-ghost py-3 flex items-center justify-center gap-2 text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
          Don't have an account?{" "}
          <Link 
            href="/signup" 
            className="font-semibold text-[var(--navy)] hover:text-[var(--gold)] underline decoration-[var(--gold)]/30 underline-offset-4 transition-colors"
          >
            Contact System Administrator
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

