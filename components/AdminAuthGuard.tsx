"use client";

import { ReactNode } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const { data: session, isPending: isAuthPending } = useSession();
  const access = useQuery(api.profiles.getAccess);
  const router = useRouter();

  const isLoading = isAuthPending || access === undefined;

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        router.push("/login?redirect=/admin");
      } else if (!access?.canAccessAdmin) {
        // Redirect non-staff users back to enrollment if they try to access admin
        router.push("/enrollment");
      }
    }
  }, [session, access, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!session || !access?.canAccessAdmin) {
    return null;
  }

  return <>{children}</>;
}
