import { dashClient } from "@better-auth/infra/client";
import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

/**
 * Better Auth + Convex, with Better Auth Infrastructure (dashboard) client plugin.
 * The server `dash()` plugin is not registered in `convex/auth.ts` because
 * `@better-auth/infra` depends on Node/SAML code paths that do not bundle for
 * Convex’s default runtime. Set `BETTER_AUTH_API_KEY` in `.env.local` (and in
 * the Better Auth project) for the hosted dashboard to connect to this app.
 */
export const authClient = createAuthClient({
  plugins: [convexClient(), dashClient()],
});
