import { betterFetch } from "@better-fetch/fetch";
// import type { createAuth } from "./lib/auth";
import type { createAuth } from "@workspace/convex-fns/convex/lib/auth";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

type Session = ReturnType<typeof createAuth>["$Infer"]["Session"];

const getSession = async (request: NextRequest) => {
	const { data: session } = await betterFetch<Session>(
		"/api/auth/get-session",
		{
			baseURL: request.nextUrl.origin,
			headers: {
				cookie: request.headers.get("cookie") ?? "",
				origin: request.nextUrl.origin,
			},
		},
	);
	return session;
};

const signInRoutes = ["/sign-in", "/sign-up", "/verify-2fa"];

const routesThatDoesntRequireOrg = ["/org-selection"];

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	const session = await getSession(request);
	console.log(session, { sessionCookie });

	const isARouteThatDoesntRequireOrg = routesThatDoesntRequireOrg.includes(
		request.nextUrl.pathname,
	);

	if (
		session?.session &&
		// @ts-expect-error - activeOrganizationId is not typed
		!session.session.activeOrganizationId &&
		!isARouteThatDoesntRequireOrg
	) {
		const sp = new URLSearchParams({ redirectUrl: request.url });
		return NextResponse.redirect(
			new URL(`/org-selection?${sp.toString()}`, request.url),
		);
	}

	// console.log(JSON.stringify({ session, sessionCookie }, null, 2));

	const isSignInRoute = signInRoutes.includes(request.nextUrl.pathname);

	if (isSignInRoute && !sessionCookie) {
		return NextResponse.next();
	}

	if (!isSignInRoute && !sessionCookie) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	// if (isSignInRoute || request.nextUrl.pathname === "/") {
	// 	return NextResponse.redirect(new URL("/", request.url));
	// }

	return NextResponse.next();
}

export const config = {
	// runtime: "nodejs",

	matcher: ["/((?!.*\\..*|_next|api/auth).*)", "/", "/trpc(.*)"],
};
