/**
 * Login Page
 *
 * Displays the Spotify login button and handles OAuth error messages.
 * The button links to /api/auth/login which initiates the PKCE flow.
 *
 * Error messages are displayed when the callback redirects here with
 * an error query parameter (e.g., /login?error=access_denied).
 */

import { Music, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginPageProps {
	searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}

/** Map OAuth error codes to user-friendly messages */
const ERROR_MESSAGES: Record<string, string> = {
	access_denied: "You denied access to your Spotify account. Please try again to use VibeRX.",
	missing_params: "Something went wrong with the login process. Please try again.",
	session_expired: "Your login session expired. Please try again.",
	state_mismatch: "Security check failed. Please try again.",
	token_exchange_failed: "Failed to connect to Spotify. Please try again.",
	profile_fetch_failed: "Failed to fetch your Spotify profile. Please try again.",
	database_error: "A server error occurred. Please try again later.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const { error } = await searchParams;

	return (
		<main className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mb-4">
						<span className="text-3xl font-bold uppercase">
							VIBE<span className="text-vibe-cyan">RX</span>
						</span>
					</div>
					<CardTitle>Connect to Spotify</CardTitle>
					<CardDescription>
						Sign in with your Spotify account to analyze and optimize your playlists
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Error message from OAuth callback */}
					{error && (
						<div className="flex items-start gap-3 rounded-sm border border-destructive/20 bg-destructive/10 p-3">
							<ShieldAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
							<p className="text-sm text-destructive">
								{ERROR_MESSAGES[error] ?? "An unexpected error occurred. Please try again."}
							</p>
						</div>
					)}

					{/* Spotify login button -- links to route handler (not client-side nav) */}
					<Button size="xl" variant="default" className="w-full" asChild>
						<a href="/api/auth/login">
							<Music className="size-5" />
							Continue with Spotify
						</a>
					</Button>

					{/* Privacy note */}
					<div className="text-center">
						<p className="text-xs text-muted-foreground">
							We&apos;ll request access to read your playlists and create optimized copies. We never
							modify your existing playlists.
						</p>
					</div>

					{/* Back to home */}
					<Button variant="outline" className="w-full" asChild>
						<Link href="/">Back to Home</Link>
					</Button>
				</CardContent>
			</Card>
		</main>
	);
}
