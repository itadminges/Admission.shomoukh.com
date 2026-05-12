import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // --- Better Auth Tables (Singular names required by the component validator) ---
  user: defineTable({
    name: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    role: v.string(),
    lastLogin: v.optional(v.number()),
  }).index("by_email", ["email"]),

  session: defineTable({
    userId: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token", ["token"]),

  account: defineTable({
    userId: v.string(),
    accountId: v.string(),
    providerId: v.string(),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    idToken: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    password: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  verification: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_value", ["value"]),

  // --- Application Tables ---
  applications: defineTable({
    userId: v.string(),
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
    userId: v.string(),
    formData: v.any(),
    currentStep: v.number(),
    completedSteps: v.array(v.number()),
    lastSaved: v.number(),
  }).index("by_userId", ["userId"]),
});
