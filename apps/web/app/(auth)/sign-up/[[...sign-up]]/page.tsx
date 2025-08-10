import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";

export default function Page() {
	return (
		<div className="min-h-[calc(100svh-0px)] flex items-center justify-center px-4">
			<div className="w-full max-w-sm border rounded-xl p-6 shadow-sm bg-background">
				<div className="space-y-1 mb-6 text-center">
					<h1 className="text-2xl font-semibold">Create account</h1>
					<p className="text-sm text-muted-foreground">Join us in a minute</p>
				</div>

				<form className="space-y-4" method="post">
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
