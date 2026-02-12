/**
 * Spotify OAuth Callback Route
 *
 * GET /api/auth/callback
 *
 * Handles the redirect from Spotify after the user authorizes (or denies).
 * This is the most complex auth route -- it:
 *
 * 1. Validates the CSRF state parameter
 * 2. Exchanges the authorization code for access + refresh tokens (PKCE)
 * 3. Fetches the user's Spotify profile
 * 4. Creates or updates the user record in our database
 * 5. Sets httpOnly auth cookies
 * 6. Redirects to the dashboard
 *
 * Error handling: All failures redirect to /login with an error query param.
 */

import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { consumeOAuthCookies, setAuthCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SessionUser, SpotifyTokenResponse, SpotifyUserProfile } from "@/types/auth";

export async function GET(request: NextRequest): Promise<NextResponse> {
	const searchParams = request.nextUrl.searchParams;
	const code = searchParams.get("code");
	const state = searchParams.get("state");
	const error = searchParams.get("error");

	// ---- Step 1: Handle Spotify errors (e.g., user clicked "Cancel") ----
	if (error) {
		return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, request.url));
	}

	// ---- Step 2: Validate required parameters ----
	if (!code || !state) {
		return NextResponse.redirect(new URL("/login?error=missing_params", request.url));
	}

	// ---- Step 3: Consume OAuth cookies (state + code_verifier) ----
	// These were set in /api/auth/login and should only be used once
	const oauthCookies = await consumeOAuthCookies();
	if (!oauthCookies) {
		return NextResponse.redirect(new URL("/login?error=session_expired", request.url));
	}

	// ---- Step 4: Validate state matches (CSRF protection) ----
	if (state !== oauthCookies.state) {
		return NextResponse.redirect(new URL("/login?error=state_mismatch", request.url));
	}

	// ---- Step 5: Exchange authorization code for tokens ----
	let tokens: SpotifyTokenResponse;
	try {
		const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "authorization_code",
				code,
				redirect_uri: env.SPOTIFY_REDIRECT_URI,
				client_id: env.SPOTIFY_CLIENT_ID,
				// Include client_secret for extra security (we're a confidential server-side client)
				client_secret: env.SPOTIFY_CLIENT_SECRET,
				code_verifier: oauthCookies.codeVerifier,
			}),
		});

		if (!tokenResponse.ok) {
			const errorBody = await tokenResponse.text();
			console.error("Token exchange failed:", tokenResponse.status, errorBody);
			return NextResponse.redirect(new URL("/login?error=token_exchange_failed", request.url));
		}

		tokens = (await tokenResponse.json()) as SpotifyTokenResponse;
	} catch (err) {
		console.error("Token exchange error:", err);
		return NextResponse.redirect(new URL("/login?error=token_exchange_failed", request.url));
	}

	// ---- Step 6: Fetch user profile from Spotify ----
	let profile: SpotifyUserProfile;
	try {
		const profileResponse = await fetch("https://api.spotify.com/v1/me", {
			headers: { Authorization: `Bearer ${tokens.access_token}` },
		});

		if (!profileResponse.ok) {
			console.error("Profile fetch failed:", profileResponse.status);
			return NextResponse.redirect(new URL("/login?error=profile_fetch_failed", request.url));
		}

		profile = (await profileResponse.json()) as SpotifyUserProfile;
	} catch (err) {
		console.error("Profile fetch error:", err);
		return NextResponse.redirect(new URL("/login?error=profile_fetch_failed", request.url));
	}

	// ---- Step 7: Upsert user in database ----
	// Creates a new user record or updates the existing one
	try {
		await prisma.user.upsert({
			where: { id: profile.id },
			update: {
				displayName: profile.display_name,
				profileImage: profile.images?.[0]?.url ?? null,
				lastLoginAt: new Date(),
			},
			create: {
				id: profile.id,
				spotifyId: profile.id,
				displayName: profile.display_name,
				profileImage: profile.images?.[0]?.url ?? null,
			},
		});
	} catch (err) {
		console.error("User upsert error:", err);
		return NextResponse.redirect(new URL("/login?error=database_error", request.url));
	}

	// ---- Step 8: Build session user and set cookies ----
	const sessionUser: SessionUser = {
		id: profile.id,
		displayName: profile.display_name,
		profileImage: profile.images?.[0]?.url ?? null,
	};

	await setAuthCookies({
		accessToken: tokens.access_token,
		refreshToken: tokens.refresh_token ?? "", // Always present on initial authorization
		expiresIn: tokens.expires_in,
		user: sessionUser,
	});

	// ---- Step 9: Redirect to dashboard ----
	return NextResponse.redirect(new URL("/dashboard", request.url));
}
