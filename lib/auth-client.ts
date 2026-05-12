import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  // Use the site URL from env for the client
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || window.location.origin,
  plugins: [
    convexClient()
  ],
});

export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession, 
  forgetPassword, 
  resetPassword, 
  verifyEmail 
} = authClient;
