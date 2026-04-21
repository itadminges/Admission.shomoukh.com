import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminDashboard } from "./access";

export const submit = mutation({
  args: {
    formData: v.any(),
  },
  handler: async (ctx, args) => {
    const year = new Date().getFullYear();
    const ref = `SHM-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    await ctx.db.insert("applications", {
      referenceNumber: ref,
      submittedAt: Date.now(),
      status: "pending",
      formData: args.formData,
    });
    return { referenceNumber: ref };
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
      v.literal("rejected"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdminDashboard(ctx);
    await ctx.db.patch(args.applicationId, { status: args.status });
  },
});
