import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import { query } from "./_generated/server";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL ?? process.env.BETTER_AUTH_SITE_URL ?? process.env.BETTER_AUTH_URL ?? "";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [
      "http://localhost:3000",
      "https://admission.shomoukh.com",
      "https://stage.forms.shomoukh.com",
      ...(siteUrl ? [siteUrl] : []),
      ...(process.env.NEXT_PUBLIC_CONVEX_SITE_URL ? [process.env.NEXT_PUBLIC_CONVEX_SITE_URL] : []),
    ],
    database: authComponent.adapter(ctx),
    advanced: {
      cookieOptions: {
        // Disable secure cookies if we're on a development deployment or using a non-https URL
        secure: siteUrl.startsWith("https") && !siteUrl.includes("localhost") && !siteUrl.includes("192.168."),
        sameSite: "Lax",
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [convex({ authConfig })],
  });
};

/** Nullable current Better Auth user for public sessions */
export const getViewer = query({
  args: {},
  handler: async (ctx) => authComponent.safeGetAuthUser(ctx),
});
