import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { createAuth } from "./auth";

/**
 * Seed the initial accounts for testing.
 * npx convex run seed:createTestAccounts
 */
export const createTestAccounts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const auth = createAuth(ctx);

    const accounts = [
      {
        name: "Admin User",
        email: "admin@shomoukh.com",
        password: "password123",
        role: "admin",
      },
      {
        name: "Parent User",
        email: "parent@shomoukh.com",
        password: "password123",
        role: "parent",
      },
    ];

    for (const acc of accounts) {
      // Check if user already exists
      const existingUser = await ctx.db
        .query("user")
        .withIndex("by_email", (q) => q.eq("email", acc.email))
        .unique();

      if (existingUser) {
        console.log(`User ${acc.email} already exists, updating role...`);
        await ctx.db.patch(existingUser._id, { role: acc.role });
        continue;
      }

      console.log(`Creating user ${acc.email}...`);
      
      // Use Better Auth API to create user (handles password hashing)
      // Note: We use the internal API to bypass email verification requirement if possible
      // but signUpEmail is usually the way.
      try {
        const result = await auth.api.signUpEmail({
          body: {
            email: acc.email,
            password: acc.password,
            name: acc.name,
          },
        });

        if (result.user) {
          // Update the role after creation
          await ctx.db.patch(result.user.id as any, { 
            role: acc.role,
            emailVerified: true // Mark as verified so they can login immediately
          });
          console.log(`Successfully created ${acc.email}`);
        }
      } catch (error) {
        console.error(`Failed to create ${acc.email}:`, error);
      }
    }
  },
});
