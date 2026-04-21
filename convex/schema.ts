import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  applications: defineTable({
    referenceNumber: v.string(),
    submittedAt: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewing"),
      v.literal("accepted"),
      v.literal("rejected"),
    ),
    /** Full enrolment payload (typed on the client as EnrollmentFormData) */
    formData: v.any(),
  })
    .index("by_reference", ["referenceNumber"])
    .index("by_status", ["status"])
    .index("by_submitted", ["submittedAt"]),

  /** Maps Better Auth user ids to dashboard roles (admins / admissions staff). */
  staffRoles: defineTable({
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff")),
  }).index("by_userId", ["userId"]),
});
