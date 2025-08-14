import { convexAdapter } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { api } from "../_generated/api.js";
import type { GenericCtx } from "../_generated/server.js";
import { betterAuthComponent } from "../auth.js";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";

export const createAuth = (ctx: GenericCtx): ReturnType<typeof betterAuth> => {
	const secret = process.env.BETTER_AUTH_SECRET;
	console.log("secret", secret);
	if (!secret) {
		throw new Error("BETTER_AUTH_SECRET is not set");
	}
	return betterAuth({
		secret,
		baseURL: siteUrl,
		database: convexAdapter(ctx, betterAuthComponent),
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
		},
		plugins: [
			convex({
				options: {
					secret,
				},
			}),

			organization({
				organizationCreation: {
					afterCreate: async ({ organization, user, member }) => {
						console.log({ organization, user, member });
						await (ctx as any).runMutation(api.organizations.upsertByAuthId, {
							authOrganizationId: organization.id,
							name: organization.name,
							slug: organization.slug,
						});
						await (ctx as any).runMutation(api.users.setOrganization, {
							userId: user.userId,
							organizationId: organization.id,
						});
					},
				},
			}),
		],
	});
};
