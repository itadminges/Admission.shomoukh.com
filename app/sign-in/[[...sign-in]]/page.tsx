import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center">
          <img
            className="mx-auto h-20 w-auto mb-6"
            src="/Shomoukh-01.png"
            alt="Shomoukh Early Childhood Education"
          />
          <h2 className="text-center text-3xl font-serif font-bold tracking-tight text-navy">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Welcome back to the admissions portal
          </p>
        </div>
        <div className="mt-8">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: "bg-navy hover:bg-navy/90 text-sm normal-case shadow-lg",
                card: "shadow-none bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-slate-200 hover:bg-slate-50 text-slate-600 font-medium",
                footerActionText: "text-slate-500",
                footerActionLink: "text-gold hover:text-gold-dark font-semibold",
                dividerLine: "bg-slate-200",
                dividerText: "text-slate-400 text-xs",
                formFieldLabel: "text-navy font-semibold",
                formFieldInput: "border-slate-200 focus:border-gold focus:ring-gold rounded-xl",
              }
            }}
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}
