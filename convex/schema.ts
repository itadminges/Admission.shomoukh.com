import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // --- Application Tables ---
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.string(), // "admin", "staff", "parent"
  }).index("by_clerkId", ["clerkId"]).index("by_email", ["email"]),

  applications: defineTable({
    userId: v.string(), // Clerk user ID (sub)
    referenceNumber: v.string(),
    submittedAt: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewing"),
      v.literal("accepted"),
    ),
    formData: v.any(),
    comments: v.optional(v.array(v.object({
      author: v.string(),
      text: v.string(),
      timestamp: v.number(),
      context: v.optional(v.string()),
      isStaff: v.optional(v.boolean()),
      isPrivate: v.optional(v.boolean()),
    }))),
  })
    .index("by_userId", ["userId"])
    .index("by_reference", ["referenceNumber"])
    .index("by_status", ["status"])
    .index("by_submitted", ["submittedAt"]),

  drafts: defineTable({
    userId: v.string(), // Clerk user ID (sub)
    formData: v.any(),
    currentStep: v.number(),
    completedSteps: v.array(v.number()),
    lastSaved: v.number(),
  }).index("by_userId", ["userId"]),
});
