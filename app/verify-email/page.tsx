"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "@/lib/auth-client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    const verify = async () => {
      const { error } = await verifyEmail({
        token: token,
      });

      if (error) {
        setStatus("error");
        setMessage(error.message || "Failed to verify email.");
        toast.error(error.message || "Verification failed");
      } else {
        setStatus("success");
        setMessage("Your email has been successfully verified!");
        toast.success("Email verified!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
    };

    verify();
  }, [token, router]);

  return (
    <Card className="w-full max-w-md shadow-lg text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          {status === "loading" && <Loader2 className="w-12 h-12 text-primary animate-spin" />}
          {status === "success" && <CheckCircle2 className="w-12 h-12 text-green-500" />}
          {status === "error" && <XCircle className="w-12 h-12 text-destructive" />}
        </div>
        <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "success" && (
          <p className="text-sm text-muted-foreground mb-4">
            You will be redirected to the dashboard in a few seconds...
          </p>
        )}
        {status !== "loading" && (
          <Button asChild className="w-full">
            <a href={status === "success" ? "/dashboard" : "/login"}>
              {status === "success" ? "Go to Dashboard" : "Back to Login"}
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin" />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
