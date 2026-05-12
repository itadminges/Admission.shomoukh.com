import type { MutationCtx, QueryCtx } from "./_generated/server";
import { authComponent } from "./auth";

/** Better Auth user document id (Convex `user` table in the auth component). */
export function authUserId(user: { _id: string }) {
  return user._id as string;
}

export async function requireAdminDashboard(ctx: QueryCtx | MutationCtx) {
  const user = await authComponent.safeGetAuthUser(ctx);
  if (!user) {
    throw new Error("Not authenticated");
  }
  
  const uid = authUserId(user);
  const row = await ctx.db
    .query("staffRoles")
    .withIndex("by_userId", (q) => q.eq("userId", uid))
    .unique();

  if (row?.role === "admin" || row?.role === "staff") {
    return user;
  }
  
  // Fallback for bootstrap emails only if no other staff exist
  const startingAdmins = ["admin@shomoukh.com", "staff@shomoukh.com", "test@example.com"];
  if (startingAdmins.includes(user.email.toLowerCase())) {
     return user;
  }

  throw new Error("Unauthorized");
}
