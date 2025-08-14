"use client";

import { api } from "@workspace/convex-fns/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { useQuery } from "convex/react";
import { jwtDecode } from "jwt-decode";
import { authClient } from "@/lib/auth-client";

export default function App() {
	return <Dashboard />;
}

function Dashboard() {
	const user = useQuery(api.auth.getCurrentUser);

	return (
		<div>
			<Card className="p-4">
				<div>Hello {user?.name}!</div>
				<code>{JSON.stringify(user, null, 2)}</code>
			</Card>
			<Button type="button" onClick={() => authClient.signOut()}>
				Sign out
			</Button>
		</div>
	);
}
