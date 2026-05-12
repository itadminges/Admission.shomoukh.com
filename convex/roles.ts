import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { components } from "./_generated/api";

/**
 * Update a user's role.
 * npx convex run roles:setRole '{"email": "admin@shomoukh.com", "role": "admin"}'
 */
export const setRole = internalMutation({
  args: {
    email: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(components.betterAuth.adapter.findOne, { 
      // @ts-ignore
      model: "user", 
      where: [{ field: "email", operator: "eq", value: args.email }] 
    });

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.runMutation(components.betterAuth.adapter.updateOne, {
      input: {
        // @ts-ignore
        model: "user",
        where: [{ field: "_id", operator: "eq", value: user._id }],
        update: { role: args.role }
      }
    });

    console.log(`Updated role for ${args.email} to ${args.role}`);
  },
});
