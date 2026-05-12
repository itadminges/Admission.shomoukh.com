import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAccess = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { canAccessAdmin: false, role: null };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      // Fallback for bootstrap admins based on email
      const startingAdmins = ["admin@shomoukh.com", "staff@shomoukh.com", "test@example.com"];
      if (identity.email && startingAdmins.includes(identity.email.toLowerCase())) {
        return { canAccessAdmin: true, role: "admin" };
      }
      return { canAccessAdmin: false, role: "parent" };
    }

    return {
      canAccessAdmin: user.role === "admin" || user.role === "staff",
      role: user.role,
    };
  },
});

export const syncUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
      });
      return existing._id;
    } else {
      // New user, default role is parent unless it's a bootstrap admin
      const startingAdmins = ["admin@shomoukh.com", "staff@shomoukh.com", "test@example.com"];
      const role = startingAdmins.includes(args.email.toLowerCase()) ? "admin" : "parent";
      
      return await ctx.db.insert("users", {
        clerkId: identity.subject,
        name: args.name,
        email: args.email,
        role,
      });
    }
  },
});
