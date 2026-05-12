import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Assign a role to a user by their email.
 * Run this from the Convex CLI to setup the first admin:
 * npx convex run internal:roles:setRole '{"email": "admin@example.com", "role": "admin"}'
 */
export const setRole = internalMutation({
  args: {
    email: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      throw new Error(`User with email ${args.email} not found`);
    }

    await ctx.db.patch(user._id, {
      role: args.role,
    });

    console.log(`Updated role for ${args.email} to ${args.role}`);
  },
});
