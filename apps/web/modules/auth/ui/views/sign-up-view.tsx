"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { authClient } from "@/lib/auth-client";

export function SignUpView() {
	const router = useRouter();
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget as HTMLFormElement);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const name = formData.get("name") as string;

		await authClient.signUp.email(
			{ email, password, name },
			{
				onError: (ctx) => {
					window.alert(ctx.error.message);
				},
				onSuccess: async () => {
					console.log("sign up success");
					try {
						await authClient.signIn.email(
							{ email, password },
							{
								onError: (ctx) => {
									window.alert(ctx.error.message);
								},
							},
						);
						router.push("/");
					} catch (error) {
						console.error(error);
						window.alert("Sign in failed after sign up");
					}
				},
			},
		);
	};

	return (
		<div className="min-h-[calc(100svh-0px)] flex items-center justify-center px-4">
			<div className="w-full max-w-sm border rounded-xl p-6 shadow-sm bg-background">
				<div className="space-y-1 mb-6 text-center">
					<h1 className="text-2xl font-semibold">Create account</h1>
					<p className="text-sm text-muted-foreground">Join us in a minute</p>
				</div>

				<form className="space-y-4" method="post" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<label htmlFor="name" className="text-sm font-medium">
							Name
						</label>
						<Input
							id="name"
							name="name"
							type="text"
							autoComplete="name"
							required
							placeholder="Ada Lovelace"
						/>
					</div>

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
							autoComplete="new-password"
							required
							placeholder="••••••••"
						/>
					</div>

					<Button type="submit" className="w-full">
						Sign up
					</Button>
				</form>

				<div className="mt-6 text-center text-sm text-muted-foreground">
					Already have an account?{" "}
					<Link href="/sign-in" className="text-primary hover:underline">
						Sign in
					</Link>
				</div>
			</div>
		</div>
	);
}
