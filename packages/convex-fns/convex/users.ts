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
		});
		return user;
	},
});
