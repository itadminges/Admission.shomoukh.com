import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  applications: defineTable({
    userId: v.string(), // The Better Auth user ID
    referenceNumber: v.string(),
    submittedAt: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewing"),
      v.literal("accepted"),
    ),
    /** Full enrolment payload (typed on the client as EnrollmentFormData) */
    formData: v.any(),
    /** Internal staff comments on the application */
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

  /** Stores in-progress enrollment forms. */
  drafts: defineTable({
    userId: v.string(), // Better Auth user ID
    formData: v.any(),
    currentStep: v.number(),
    completedSteps: v.array(v.number()),
    lastSaved: v.number(),
  }).index("by_userId", ["userId"]),

  /** Stores additional user-specific data (Parent profile, phone, etc.) */
  userProfiles: defineTable({
    userId: v.string(), // Matches Better Auth user ID
    email: v.string(),
    name: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    address: v.optional(v.string()),
    lastLogin: v.optional(v.number()),
  }).index("by_userId", ["userId"])
    .index("by_email", ["email"]),

  /** Maps Better Auth user ids to dashboard roles (admins / admissions staff). */
  staffRoles: defineTable({
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff")),
  }).index("by_userId", ["userId"]),
});
