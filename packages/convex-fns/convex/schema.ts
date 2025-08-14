import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		email: v.string(),
		name: v.optional(v.string()),
		image: v.optional(v.string()),
		orgId: v.optional(v.id("organizations")),
	}).index("by_email", ["email"]),

	organizations: defineTable({
		authOrganizationId: v.string(),
		name: v.optional(v.string()),
		slug: v.optional(v.string()),
	}).index("by_auth_org_id", ["authOrganizationId"]),
});
