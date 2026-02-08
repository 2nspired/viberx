/**
 * Dashboard Page
 *
 * Protected page that shows the authenticated user's profile.
 * This is a Server Component that reads the session directly from cookies.
 *
 * If no session exists, redirects to /login (defense-in-depth on top of middleware).
 *
 * Future checkpoints will add:
 * - Playlist grid (Checkpoint 4)
 * - Analysis view (Checkpoint 5)
 * - Optimization controls (Checkpoint 6)
 */

import { Music } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
	const session = await getSession();

	if (!session) {
		redirect("/login");
	}

	const { user } = session;

	return (
		<main className="min-h-screen p-4 md:p-8">
			<div className="mx-auto max-w-4xl">
				{/* Header with logo and sign out */}
				<div className="mb-8 flex items-center justify-between">
					<h1 className="text-2xl font-bold uppercase">
						VIBE<span className="text-vibe-cyan">RX</span>
					</h1>
					<LogoutButton />
				</div>

				{/* User Profile Card */}
				<Card variant="rx" className="mb-8">
					<CardHeader>
						<div className="flex items-center gap-4">
							{user.profileImage ? (
								<Image
									src={user.profileImage}
									alt={user.displayName ?? "Profile"}
									width={64}
									height={64}
									className="rounded-sm"
								/>
							) : (
								<div className="flex size-16 items-center justify-center rounded-sm bg-muted">
									<Music className="size-8 text-muted-foreground" />
								</div>
							)}
							<div>
								<CardTitle className="text-xl">
									Welcome, {user.displayName ?? "Music Lover"}
								</CardTitle>
								<CardDescription>{user.email}</CardDescription>
								{user.product && (
									<Badge variant="secondary" className="mt-1 capitalize">
										Spotify {user.product}
									</Badge>
								)}
							</div>
						</div>
					</CardHeader>
				</Card>

				{/* Placeholder for playlists - coming in Checkpoint 4 */}
				<Card>
					<CardContent className="py-12 text-center">
						<div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-sm bg-muted">
							<Music className="size-8 text-muted-foreground" />
						</div>
						<h2 className="mb-2 text-lg font-semibold">Your Playlists</h2>
						<p className="text-sm text-muted-foreground">
							Playlist fetching and analysis will be available in the next checkpoint.
						</p>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
