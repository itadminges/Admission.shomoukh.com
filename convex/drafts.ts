import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authUserId } from "./access";
import { authComponent } from "./auth";

export const save = mutation({
  args: {
    formData: v.any(),
    currentStep: v.number(),
    completedSteps: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");
    
    const uid = authUserId(user);
    const existing = await ctx.db
      .query("drafts")
      .withIndex("by_userId", (q) => q.eq("userId", uid))
      .unique();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        formData: args.formData,
        currentStep: args.currentStep,
        completedSteps: args.completedSteps,
        lastSaved: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("drafts", {
        userId: uid,
        formData: args.formData,
        currentStep: args.currentStep,
        completedSteps: args.completedSteps,
        lastSaved: Date.now(),
      });
    }
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;
    
    const uid = authUserId(user);
    return await ctx.db
      .query("drafts")
      .withIndex("by_userId", (q) => q.eq("userId", uid))
      .unique();
  },
});

export const remove = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return;
    
    const uid = authUserId(user);
    const existing = await ctx.db
      .query("drafts")
      .withIndex("by_userId", (q) => q.eq("userId", uid))
      .unique();
    
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
