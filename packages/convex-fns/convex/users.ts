import type { Id } from "@workspace/convex-fns/_generated/dataModel.js";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server.js";

export const getMany = query({
	handler: async (ctx) => {
		const users = await ctx.db.query("users").collect();
		return users;
	},
});

export const create = mutation({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();

		console.log(identity);

		if (!identity) {
			throw new Error("Unauthorized");
		}

		const user = await ctx.db.insert("users", {
			name: "John Doe",
			email: identity.email ?? "",
		});
		return user;
	},
});

export const setOrganization = mutation({
	args: {
		userId: v.string(),
		organizationId: v.string(),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		let orgId: Id<"organizations"> | undefined =
			undefined as unknown as Id<"organizations">;
		const existingOrg = await ctx.db
			.query("organizations")
			.withIndex("by_auth_org_id", (q) =>
				q.eq("authOrganizationId", args.organizationId),
			)
			.unique();
		if (existingOrg) {
			orgId = existingOrg._id as Id<"organizations">;
		}
		await ctx.db.patch(args.userId as Id<"users">, {
			orgId,
		});
		return null;
	},
});
