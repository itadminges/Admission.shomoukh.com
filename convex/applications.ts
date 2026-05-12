import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminDashboard, getAuthUserId } from "./access";

export const submit = mutation({
  args: {
    formData: v.any(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const year = new Date().getFullYear();
    const ref = `SHM-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const id = await ctx.db.insert("applications", {
      userId,
      referenceNumber: ref,
      submittedAt: Date.now(),
      status: "pending",
      formData: args.formData,
      comments: [],
    });
    
    return { referenceNumber: ref, applicationId: id };
  },
});

export const listForUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("applications")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    const app = await ctx.db.get(args.id);
    if (!app) return null;
    
    // Allow if owner or admin/staff
    let isStaff = false;
    try {
      await requireAdminDashboard(ctx);
      isStaff = true;
    } catch (e) {
      if (app.userId !== userId) return null;
    }
    
    return app;
  },
});

export const listForAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminDashboard(ctx);
    return await ctx.db.query("applications").order("desc").collect();
  },
});

export const updateStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewing"),
      v.literal("accepted"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdminDashboard(ctx);
    await ctx.db.patch(args.applicationId, { status: args.status });
  },
});

export const addComment = mutation({
  args: {
    applicationId: v.id("applications"),
    text: v.string(),
    context: v.optional(v.string()),
    isPrivate: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const app = await ctx.db.get(args.applicationId);
    if (!app) throw new Error("Application not found");
    
    const userId = identity.subject;
    
    // Check if user is Admin/Staff
    let isStaff = false;
    try {
      await requireAdminDashboard(ctx);
      isStaff = true;
    } catch (e) {
      // Not staff, check if owner
      if (app.userId !== userId) {
        throw new Error("Unauthorized");
      }
    }
    
    const comments = app.comments || [];
    comments.push({
      author: isStaff ? `Staff (${identity.name || "Admin"})` : `Parent (${identity.name || "Applicant"})`,
      text: args.text,
      context: args.context,
      timestamp: Date.now(),
      isStaff,
      isPrivate: isStaff ? (args.isPrivate ?? true) : false,
    });
    await ctx.db.patch(args.applicationId, { comments });
  },
});
