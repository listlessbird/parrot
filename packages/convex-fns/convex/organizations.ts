import { v } from "convex/values";
import { mutation } from "./_generated/server.js";

export const upsertByAuthId = mutation({
	args: {
		authOrganizationId: v.string(),
		name: v.optional(v.string()),
		slug: v.optional(v.string()),
	},
	returns: v.id("organizations"),
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("organizations")
			.withIndex("by_auth_org_id", (q) =>
				q.eq("authOrganizationId", args.authOrganizationId),
			)
			.unique();

		if (existing) {
			await ctx.db.patch(existing._id, {
				name: args.name,
				slug: args.slug,
			});
			return existing._id;
		}

		const orgId = await ctx.db.insert("organizations", {
			authOrganizationId: args.authOrganizationId,
			name: args.name,
			slug: args.slug,
		});
		return orgId;
	},
});
