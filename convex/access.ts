import type { MutationCtx, QueryCtx } from "./_generated/server";
import { authComponent } from "./auth";

/** Better Auth user document id (Convex `user` table in the component). */
export function authUserId(user: any) {
  return user.id || user._id;
}

/**
 * Access control for admin/staff dashboard.
 */
export async function requireAdminDashboard(ctx: QueryCtx | MutationCtx) {
  const user = await authComponent.safeGetAuthUser(ctx) as any;
  if (!user) {
    throw new Error("Not authenticated");
  }
  
  // In our new schema, the role is directly on the user document
  if (user.role === "admin" || user.role === "staff") {
    return user;
  }
  
  // Fallback for bootstrap emails during initial setup
  const startingAdmins = ["admin@shomoukh.com", "staff@shomoukh.com", "test@example.com"];
  if (startingAdmins.includes(user.email.toLowerCase())) {
     return user;
  }

  throw new Error("Unauthorized");
}
