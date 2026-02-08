/**
 * Logout Button Component
 *
 * Client component that calls POST /api/auth/logout to clear auth cookies,
 * then redirects to the home page and refreshes server components.
 */

"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
	const router = useRouter();

	async function handleLogout() {
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/");
		router.refresh();
	}

	return (
		<Button variant="outline" size="sm" onClick={handleLogout}>
			<LogOut className="size-4" />
			Sign Out
		</Button>
	);
}
