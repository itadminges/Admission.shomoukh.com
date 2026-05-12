import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { createAuth } from "./auth";
import { components } from "./_generated/api";

/**
 * Seed the initial accounts for testing.
 * npx convex run seed:createTestAccounts --prod
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
      console.log(`\n--- Processing ${acc.email} ---`);

      // 1. Check if user already exists via the component internal query
      const existingUser = await ctx.runQuery(components.betterAuth.adapter.findOne, { 
        // @ts-ignore
        model: "user", 
        where: [{ field: "email", operator: "eq", value: acc.email }] 
      });

      if (existingUser) {
        console.log(`User already exists. Updating role...`);
        await ctx.runMutation(components.betterAuth.adapter.updateOne, {
          input: {
            // @ts-ignore
            model: "user",
            where: [{ field: "_id", operator: "eq", value: existingUser._id }],
            update: { role: acc.role, emailVerified: true }
          }
        });
        console.log(`Updated existing user ${acc.email}`);
        continue;
      }

      // 2. Try to create via Better Auth API
      console.log(`Creating user via Better Auth API...`);
      try {
        const result = await auth.api.signUpEmail({
          body: {
            email: acc.email,
            password: acc.password,
            name: acc.name,
          },
        });

        if (result && result.user) {
          const userId = result.user.id;
          console.log(`User created with ID: ${userId}`);

          // 3. Post-creation updates (role and verification)
          await ctx.runMutation(components.betterAuth.adapter.updateOne, {
            input: {
              // @ts-ignore
              model: "user",
              where: [{ field: "_id", operator: "eq", value: userId }],
              update: { role: acc.role, emailVerified: true }
            }
          });
          console.log(`Successfully initialized ${acc.email}`);
        }
      } catch (error: any) {
        console.error(`Better Auth API failed for ${acc.email}:`);
        console.error(`Message: ${error.message || error}`);
      }
    }
  },
});
