import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authUserId } from "./access";
import { authComponent } from "./auth";

export const getAccess = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      return {
        viewer: null,
        canAccessAdmin: false,
        role: null as "admin" | "staff" | null,
      };
    }
    const emails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const uid = authUserId(user);
    const roleDoc = await ctx.db
      .query("staffRoles")
      .withIndex("by_userId", (q) => q.eq("userId", uid))
      .unique();
    const emailAllow = emails.includes(user.email.toLowerCase());
    const storedRole = roleDoc?.role ?? null;
    const canAccessAdmin =
      emailAllow || storedRole === "admin" || storedRole === "staff";
    return {
      viewer: {
        id: uid,
        email: user.email,
        name: user.name,
        image: user.image ?? null,
      },
      canAccessAdmin,
      role: emailAllow ? ("admin" as const) : storedRole,
    };
  },
});

/**
 * One-time or rare promotion of a user to staff/admin.
 * Convex dashboard / CLI (internal mutation):
 * npx convex run internal:profiles:grantStaffRole '{"secret":"...","userId":"...","role":"admin"}'
 */
export const grantStaffRole = internalMutation({
  args: {
    secret: v.string(),
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff")),
  },
  handler: async (ctx, args) => {
    const expected = process.env.STAFF_ROLE_SETUP_SECRET;
    if (!expected || args.secret !== expected) {
      throw new Error("Forbidden");
    }
    const existing = await ctx.db
      .query("staffRoles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { role: args.role });
    } else {
      await ctx.db.insert("staffRoles", {
        userId: args.userId,
        role: args.role,
      });
    }
  },
});
