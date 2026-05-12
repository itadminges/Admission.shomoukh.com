import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminDashboard, authUserId } from "./access";
import { authComponent } from "./auth";
import { components } from "./_generated/api";

export const submit = mutation({
  args: {
    formData: v.any(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");
    
    const uid = authUserId(user);
    const year = new Date().getFullYear();
    const ref = `SHM-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const id = await ctx.db.insert("applications", {
      userId: uid,
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
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];
    
    const uid = authUserId(user);
    return await ctx.db
      .query("applications")
      .withIndex("by_userId", (q) => q.eq("userId", uid))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;
    
    const app = await ctx.db.get(args.id);
    if (!app) return null;
    
    const uid = authUserId(user);
    
    // Allow if owner or admin/staff
    let isStaff = false;
    try {
      await requireAdminDashboard(ctx);
      isStaff = true;
    } catch (e) {
      if (app.userId !== uid) return null;
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
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");
    
    const app = await ctx.db.get(args.applicationId);
    if (!app) throw new Error("Application not found");
    
    const uid = authUserId(user);
    
    // Check if user is Admin/Staff
    let isStaff = false;
    try {
      await requireAdminDashboard(ctx);
      isStaff = true;
    } catch (e) {
      // Not staff, check if owner
      if (app.userId !== uid) {
        throw new Error("Unauthorized");
      }
    }
    
    const comments = app.comments || [];
    comments.push({
      author: isStaff ? `Staff (${user.name || "Admin"})` : `Parent (${user.name || "Applicant"})`,
      text: args.text,
      context: args.context,
      timestamp: Date.now(),
      isStaff,
      isPrivate: isStaff ? (args.isPrivate ?? true) : false,
    });
    await ctx.db.patch(args.applicationId, { comments });
  },
});

export const seedDummyData = internalMutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // @ts-ignore
    const user = await ctx.runQuery(components.betterAuth.adapter.findOne, { 
      model: "user", 
      where: [{ field: "email", operator: "eq", value: args.email }] 
    });
    
    if (!user) {
      throw new Error(`User with email ${args.email} not found. Please sign up first.`);
    }
    
    const uid = user.id;
    const year = new Date().getFullYear();
    const ref = `SHM-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const id = await ctx.db.insert("applications", {
      userId: uid,
      referenceNumber: ref,
      submittedAt: Date.now(),
      status: "reviewing",
      formData: {
        studentData: {
          givenNames: "Sami",
          familyName: "Fairoz",
          dateOfBirth: "2018-05-15",
          gender: "male",
          nationality: "Omani",
        },
        familyData: {
          fatherName: "Fairoz Al Balushi",
          fatherPhone: "+968 9123 4567",
          fatherEmail: args.email,
        }
      },
      comments: [
        {
          author: "Staff (System)",
          text: "Application received and currently under preliminary review.",
          timestamp: Date.now() - 86400000,
          isStaff: true,
          isPrivate: false
        }
      ],
    });
    
    return { referenceNumber: ref, applicationId: id };
  },
});
