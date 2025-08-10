"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const formSchema = z
	.object({
		name: z
			.string()
			.min(2, { message: "Name must be at least 2 characters." })
			.max(100, { message: "Name must be at most 100 characters." }),
		slug: z
			.string()
			.max(100, { message: "Slug must be at most 100 characters." })
			.default(""),
	})
	.superRefine((val, ctx) => {
		if (val.slug && val.slug.length > 0) {
			if (val.slug.length < 2) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Slug must be at least 2 characters.",
					path: ["slug"],
				});
			}
			if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val.slug)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Use lowercase letters, numbers, and hyphens.",
					path: ["slug"],
				});
			}
		}
	});

export function OrgSelectView() {
	const { data: activeOrganization, isPending: activePending } =
		authClient.useActiveOrganization();
	const {
		data: organizations,
		isPending: listPending,
		refetch,
	} = authClient.useListOrganizations();
	const [creating, setCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	type FormValues = { name: string; slug: string };
	const resolver = zodResolver(
		formSchema,
	) as unknown as import("react-hook-form").Resolver<FormValues>;
	const form = useForm<FormValues>({
		resolver,
		defaultValues: { name: "", slug: "" },
		mode: "onTouched",
	});

	const hasOrgs = (organizations?.length ?? 0) > 0;

	const [settingActiveOrgId, setSettingActiveOrgId] = useState<string | null>(
		null,
	);
	const handleSetActive = async (organizationId: string) => {
		setError(null);
		setSettingActiveOrgId(organizationId);
		const res = await authClient.organization.setActive({ organizationId });
		if (res?.error)
			setError(res.error.message ?? "Failed to set active organization");
		refetch();
		setSettingActiveOrgId(null);
	};

	const handleCreate = async (values: FormValues) => {
		setCreating(true);
		setError(null);
		const computedSlug =
			values.slug && values.slug.length > 0
				? values.slug
				: values.name
						.toLowerCase()
						.trim()
						.replace(/\s+/g, "-")
						.replace(/[^a-z0-9-]/g, "");
		const res = await authClient.organization.create({
			name: values.name.trim(),
			slug: computedSlug,
		});
		if (res?.error)
			setError(res.error.message ?? "Failed to create organization");
		setCreating(false);
		if (!res?.error) {
			form.reset({ name: "", slug: "" });
			refetch();
		}
	};

	if (activePending || listPending) {
		return <div>Loading...</div>;
	}

	if (!hasOrgs) {
		return (
			<Card className="max-w-md">
				<CardHeader>
					<CardTitle>Create your first organization</CardTitle>
					<CardDescription>
						Organizations help group users and resources.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{error && <p className="text-sm text-red-600">{error}</p>}
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleCreate)}
							className="space-y-3"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Acme Inc" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="slug"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Slug</FormLabel>
										<FormControl>
											<Input placeholder="acme-inc" {...field} />
										</FormControl>
										<FormDescription>
											Leave empty to auto-generate from name.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button disabled={creating} type="submit">
								{creating ? (
									<span className="inline-flex items-center gap-2">
										<Loader2 className="size-4 animate-spin" /> Creating...
									</span>
								) : (
									"Create Organization"
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="max-w-md">
			<CardHeader>
				<CardTitle>Organizations</CardTitle>
				<CardDescription>View and switch your organizations.</CardDescription>
			</CardHeader>
			<CardContent>
				{activeOrganization ? (
					<div className="space-y-2">
						<div className="space-y-1">
							<p className="text-sm font-medium">Active organization</p>
							<p className="text-sm text-muted-foreground">
								{activeOrganization.name} ({activeOrganization.slug})
							</p>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium">Switch organization</p>
							{error && <p className="text-sm text-red-600">{error}</p>}
							<ul className="space-y-2">
								{organizations
									?.filter((o) => o.id !== activeOrganization.id)
									.map((org) => (
										<li
											key={org.id}
											className="flex items-center justify-between gap-2"
										>
											<span className="text-sm">
												{org.name} ({org.slug})
											</span>
											<Button
												type="button"
												variant="secondary"
												disabled={settingActiveOrgId === org.id}
												onClick={() => handleSetActive(org.id)}
											>
												{settingActiveOrgId === org.id ? (
													<span className="inline-flex items-center gap-2">
														<Loader2 className="size-4 animate-spin" />{" "}
														Setting...
													</span>
												) : (
													"Set active"
												)}
											</Button>
										</li>
									))}
							</ul>
						</div>
					</div>
				) : (
					<div className="space-y-2">
						<p className="text-sm font-medium">Select an organization</p>
						{error && <p className="text-sm text-red-600">{error}</p>}
						<ul className="space-y-2">
							{organizations?.map((org) => (
								<li
									key={org.id}
									className="flex items-center justify-between gap-2"
								>
									<span className="text-sm">
										{org.name} ({org.slug})
									</span>
									<Button
										type="button"
										variant="secondary"
										disabled={settingActiveOrgId === org.id}
										onClick={() => handleSetActive(org.id)}
									>
										{settingActiveOrgId === org.id ? (
											<span className="inline-flex items-center gap-2">
												<Loader2 className="size-4 animate-spin" /> Setting...
											</span>
										) : (
											"Set active"
										)}
									</Button>
								</li>
							))}
						</ul>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
