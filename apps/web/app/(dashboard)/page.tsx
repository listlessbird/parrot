"use client";

import { api } from "@workspace/convex-fns/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function App() {
	return <Dashboard />;
}

function Dashboard() {
	const user = useQuery(api.auth.getCurrentUser);
	return (
		<div>
			<div>Hello {user?.name}!</div>
			<button type="button" onClick={() => authClient.signOut()}>
				Sign out
			</button>
		</div>
	);
}
