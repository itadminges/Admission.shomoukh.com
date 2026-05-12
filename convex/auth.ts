import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(ctx),
    
    // Map Better Auth models to our Convex tables
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

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      async sendResetPassword({ user, url, token }, request) {
        console.log(`[AUTH] Reset password link for ${user.email}: ${url}`);
      },
    },
    
    emailVerification: {
      async sendVerificationEmail({ user, url, token }, request) {
        console.log(`[AUTH] Verification link for ${user.email}: ${url}`);
      },
      sendOnSignUp: true,
    },

    rateLimit: {
      enabled: true,
      window: 60,
      max: 10,
    },

    advanced: {
      cookieOptions: {
        secure: process.env.NODE_ENV === "production" && !process.env.BETTER_AUTH_URL?.includes("localhost"),
        sameSite: "Lax",
      },
    },

    plugins: [
      convex({ authConfig }),
    ],
  });
};
