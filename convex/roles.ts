import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

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
    const adapter = authComponent.adapter(ctx) as any;
    const user = await adapter.getUserByEmail(args.email);

    if (!user) {
      throw new Error("User not found");
    }

    await adapter.updateUser(user.id, { role: args.role });

    console.log(`Updated role for ${args.email} to ${args.role}`);
  },
});
