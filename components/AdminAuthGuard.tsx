"use client";

import { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const access = useQuery(api.users.getAccess);
  const router = useRouter();

  const isLoading = !isLoaded || access === undefined;

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`${process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}?redirect_url=${encodeURIComponent("/admin")}`);
      } else if (!access?.canAccessAdmin) {
        // Redirect non-staff users back to enrollment if they try to access admin
        router.push("/enrollment");
      }
    }
  }, [user, access, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!user || !access?.canAccessAdmin) {
    return null;
  }

  return <>{children}</>;
}
