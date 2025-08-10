"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { authClient } from "@/lib/auth-client";

export function SignInView() {
	const router = useRouter();
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget as HTMLFormElement);

		await authClient.signIn.email(
			{
				email: formData.get("email") as string,
				password: formData.get("password") as string,
			},
			{
				onError: (ctx) => {
					window.alert(ctx.error.message);
				},
				onSuccess: () => {
					router.push("/");
				},
			},
		);
	};

	return (
		<div className="min-h-[calc(100svh-0px)] flex items-center justify-center px-4">
			<div className="w-full max-w-sm border rounded-xl p-6 shadow-sm bg-background">
				<div className="space-y-1 mb-6 text-center">
					<h1 className="text-2xl font-semibold">Sign in</h1>
					<p className="text-sm text-muted-foreground">Welcome back</p>
				</div>

				<form className="space-y-4" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<label htmlFor="email" className="text-sm font-medium">
							Email
						</label>
						<Input
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							required
							placeholder="you@example.com"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="password" className="text-sm font-medium">
							Password
						</label>
						<Input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							placeholder="••••••••"
						/>
					</div>

					<Button type="submit" className="w-full">
						Sign in
					</Button>
				</form>

				<div className="mt-6 text-center text-sm text-muted-foreground">
					Don't have an account?{" "}
					<Link href="/sign-up" className="text-primary hover:underline">
						Sign up
					</Link>
				</div>
			</div>
		</div>
	);
}
