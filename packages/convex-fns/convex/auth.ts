import {
	type AuthFunctions,
	BetterAuth,
	type PublicAuthFunctions,
} from "@convex-dev/better-auth";
import { v } from "convex/values";
import { api, components, internal } from "./_generated/api.js";
import type { DataModel, Id } from "./_generated/dataModel.js";
import { internalMutation, query } from "./_generated/server.js";

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
		const userId = await ctx.db.insert("users", {
			email: user.email ?? "",
			name: user.name ?? undefined,
			image: user.image ?? undefined,
		});
		return userId;
	},

	// Delete the user when they are deleted from Better Auth
	onDeleteUser: async (ctx, userId) => {
		await ctx.db.delete(userId as Id<"users">);
	},
	onUpdateUser: async (ctx, user) => {
		await ctx.db.patch(user.userId as Id<"users">, {
			email: user.email ?? "",
			name: user.name ?? undefined,
			image: user.image ?? undefined,
		});
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
		const user = await ctx.db.get(userMetadata.userId as Id<"users">);
		return {
			metadata: userMetadata,
			...user,
		};
	},
});

export const purgeJwks = internalMutation({
	args: {},
	returns: v.null(),
	handler: async (ctx) => {
		await ctx.runMutation(components.betterAuth.lib.deleteMany, {
			model: "jwks",
		} as any);
		return null;
	},
});
