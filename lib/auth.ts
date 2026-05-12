import { betterAuth } from "better-auth/minimal";
import { convexAdapter } from "@convex-dev/better-auth/adapter";
import { api as convexApi } from "../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

// We use the HTTP client for server-side database access
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  
  database: convexAdapter(
    {
      runQuery: (fn, args) => convex.query(fn, args),
      runMutation: (fn, args) => convex.mutation(fn, args),
    },
    // @ts-ignore - The component API might not be perfectly typed here but it works
    convexApi.betterAuth
  ),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "parent",
      },
      lastLogin: {
        type: "number",
        defaultValue: Date.now(),
      },
    },
  },
  session: {
    modelName: "sessions",
  },
  account: {
    modelName: "accounts",
  },
  verification: {
    modelName: "verificationTokens",
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production" && !process.env.BETTER_AUTH_URL?.includes("localhost"),
  },
});
