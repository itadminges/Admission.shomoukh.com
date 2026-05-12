import type { MutationCtx, QueryCtx } from "./_generated/server";

/**
 * Get the current user's ID from the auth identity.
 */
export async function getAuthUserId(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return identity.subject; // Clerk user ID
}

/**
 * Access control for admin/staff dashboard.
 */
export async function requireAdminDashboard(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  
  // In Clerk, we might use private metadata or public metadata for roles.
  // We'll check the identity's role if available, or fallback to email check.
  const role = identity.role as string | undefined;
  if (role === "admin" || role === "staff") {
    return identity;
  }
  
  // Fallback for bootstrap emails during initial setup
  const startingAdmins = ["admin@shomoukh.com", "staff@shomoukh.com", "test@example.com"];
  if (identity.email && startingAdmins.includes(identity.email.toLowerCase())) {
     return identity;
  }

  throw new Error("Unauthorized");
}
