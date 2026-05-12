import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./access";

export const save = mutation({
  args: {
    formData: v.any(),
    currentStep: v.number(),
    completedSteps: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const existing = await ctx.db
      .query("drafts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
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
        userId,
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
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    return await ctx.db
      .query("drafts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const remove = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    
    const existing = await ctx.db
      .query("drafts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
