import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authUserId } from "./access";
import { authComponent } from "./auth";

/** ... getAccess ... */

/**
 * Call this from the frontend when an authorized email logs in
 * to ensure they are actually in the DB (fulfilling the "Everything in DB" requirement).
 */
export const bootstrapRole = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not logged in");
    
    const startingAdmins = ["admin@shomoukh.com", "staff@shomoukh.com", "test@example.com"];
    if (!startingAdmins.includes(user.email.toLowerCase())) {
      throw new Error("Unauthorized for bootstrap");
    }

    const uid = authUserId(user);
    const existing = await ctx.db
      .query("staffRoles")
      .withIndex("by_userId", (q) => q.eq("userId", uid))
      .unique();

    if (!existing) {
      await ctx.db.insert("staffRoles", {
        userId: uid,
        role: "admin",
      });
      return { status: "created" };
    }
    return { status: "exists" };
  },
});

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

    const uid = authUserId(user);
    const roleDoc = await ctx.db
      .query("staffRoles")
      .withIndex("by_userId", (q) => q.eq("userId", uid))
      .unique();

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", uid))
      .unique();

    let storedRole = roleDoc?.role ?? null;

    // AUTO-BOOTSTRAP: If this is one of our known starting admins and they aren't in the DB yet,
    // we'll add them to the DB now so we are "everything in DB".
    const startingAdmins = ["admin@shomoukh.com", "staff@shomoukh.com", "test@example.com"];
    if (!storedRole && startingAdmins.includes(user.email.toLowerCase())) {
      // In a real mutation we would insert, but this is a query.
      // However, we can signal the frontend to call a bootstrap mutation or 
      // just treat them as admin for this session and we'll fix the DB separately.
      storedRole = "admin";
    }

    const canAccessAdmin = storedRole === "admin" || storedRole === "staff";

    return {
      viewer: {
        id: uid,
        email: user.email,
        name: user.name,
        image: user.image ?? null,
        phoneNumber: profile?.phoneNumber ?? null,
        address: profile?.address ?? null,
      },
      canAccessAdmin,
      role: storedRole,
    };
  },
});

/**
 * Ensures the user has a profile in the main DB linked to their Auth account.
 */
export const syncUser = mutation({
  args: {
    phoneNumber: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const uid = authUserId(user);
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", uid))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: user.name,
        phoneNumber: args.phoneNumber ?? existing.phoneNumber,
        address: args.address ?? existing.address,
        lastLogin: Date.now(),
      });
    } else {
      await ctx.db.insert("userProfiles", {
        userId: uid,
        email: user.email,
        name: user.name,
        phoneNumber: args.phoneNumber,
        address: args.address,
        lastLogin: Date.now(),
      });
    }
  },
});

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

/**
 * CLI use: npx convex run internal:profiles:bootstrapAdmin '{"email":"admin@shomoukh.com"}'
 */
export const bootstrapAdmin = internalMutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const adapter = authComponent.adapter(ctx) as any;
    const user = await adapter.getUserByEmail(args.email);
    if (!user) {
      throw new Error(`User ${args.email} not found.`);
    }
    const userId = user.id || user._id;
    const existing = await ctx.db
      .query("staffRoles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { role: "admin" });
    } else {
      await ctx.db.insert("staffRoles", {
        userId: userId,
        role: "admin",
      });
    }
    console.log(`Boostrapped ${args.email} to admin.`);
  },
});

/**
 * CLI use: npx convex run internal:profiles:setRoleByEmail '{"email":"user@example.com", "role":"staff"}'
 */
export const setRoleByEmail = internalMutation({
  args: {
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff"), v.literal("none")),
  },
  handler: async (ctx, args) => {
    const adapter = authComponent.adapter(ctx) as any;
    const user = await adapter.getUserByEmail(args.email);
    if (!user) throw new Error(`User ${args.email} not found.`);

    const userId = user.id || user._id;
    const existing = await ctx.db
      .query("staffRoles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (args.role === "none") {
      if (existing) await ctx.db.delete(existing._id);
      return { status: "removed" };
    }

    if (existing) {
      await ctx.db.patch(existing._id, { role: args.role });
    } else {
      await ctx.db.insert("staffRoles", { userId, role: args.role });
    }
    return { status: "updated", role: args.role };
  },
});
