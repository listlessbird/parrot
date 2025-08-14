"use client";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { AuthLayout } from "@/modules/auth/ui/layout/auth-layout";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

export function AuthGuard({ children }: { children: React.ReactNode }) {
	return (
		<>
			<AuthLoading>
				<AuthLayout>
					<p>Auth guard loading...</p>
				</AuthLayout>
			</AuthLoading>

			<Authenticated>
				<AuthLayout>{children}</AuthLayout>
			</Authenticated>

			<Unauthenticated>
				<AuthLayout>
					<SignInView />
				</AuthLayout>
			</Unauthenticated>
		</>
	);
}
