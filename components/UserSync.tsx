"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function UserSync() {
  const { user, isLoaded } = useUser();
  const syncUser = useMutation(api.users.syncUser);

  useEffect(() => {
    if (isLoaded && user) {
      syncUser({
        name: user.fullName || undefined,
        email: user.primaryEmailAddress?.emailAddress || "",
      }).catch(console.error);
    }
  }, [user, isLoaded, syncUser]);

  return null;
}
