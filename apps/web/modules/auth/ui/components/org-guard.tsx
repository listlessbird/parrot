"use client";

import { authClient } from "@/lib/auth-client";
import { OrgSelectView } from "@/modules/auth/ui/views/org-select-view";
export function OrganizationGuard({ children }: { children: React.ReactNode }) {
	const { data: activeOrganization } = authClient.useActiveOrganization();
	console.log({ activeOrganization });

	if (!activeOrganization) {
		return (
			<div>
				<p>Create an org plsss</p>
				<OrgSelectView />
			</div>
		);
	}

	return <>{children}</>;
}
