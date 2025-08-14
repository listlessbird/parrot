"use client";

import { authClient } from "@/lib/auth-client";
import { OrgSelectionView } from "@/modules/auth/ui/views/org-selection-view";
export function OrganizationGuard({ children }: { children: React.ReactNode }) {
	const { data: activeOrganization } = authClient.useActiveOrganization();
	console.log({ activeOrganization });

	if (!activeOrganization) {
		return (
			<div>
				<p>Create an org plsss</p>
				<OrgSelectionView />
			</div>
		);
	}

	return <>{children}</>;
}
