import {
	type AuthFunctions,
	BetterAuth,
	type PublicAuthFunctions,
} from "@convex-dev/better-auth";
import { api, components, internal } from "./_generated/api.js";
import type { DataModel, Id } from "./_generated/dataModel.js";
import { query } from "./_generated/server.js";

// Typesafe way to pass Convex functions defined in this file
const authFunctions: AuthFunctions = internal.auth;
const publicAuthFunctions: PublicAuthFunctions = api.auth;

// Initialize the component
export const betterAuthComponent = new BetterAuth(components.betterAuth, {
	authFunctions,
	publicAuthFunctions,
});

// These are required named exports
export const {
	createUser,
	updateUser,
	deleteUser,
	createSession,
	isAuthenticated,
} = betterAuthComponent.createAuthFunctions<DataModel>({
	// Must create a user and return the user id
	onCreateUser: async (ctx, user) => {
		console.log("onCreateUser", { user });

		// insert into app user's table

		const createdUser = {
			email: user.email,
			name: user.name,
			organizationId: undefined,
		};

		return ctx.db.insert("users", createdUser);
	},

	// Delete the user when they are deleted from Better Auth
	onDeleteUser: async (ctx, userId) => {
		await ctx.db.delete(userId as Id<"users">);
	},
});

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		// Get user data from Better Auth - email, name, image, etc.
		const userMetadata = await betterAuthComponent.getAuthUser(ctx);
		if (!userMetadata) {
			return null;
		}
		// Get user data from your application's database
		// (skip this if you have no fields in your users table schema)
		const user = await ctx.db.get(userMetadata.userId as Id<"users">);
		return {
			...user,
			...userMetadata,
		};
	},
});
