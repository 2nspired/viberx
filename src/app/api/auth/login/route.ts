/**
 * Spotify OAuth Login Route
 *
 * GET /api/auth/login
 *
 * Initiates the Spotify Authorization Code with PKCE flow:
 * 1. Generates a PKCE code verifier + challenge
 * 2. Generates a random state for CSRF protection
 * 3. Stores state + verifier in temporary httpOnly cookies
 * 4. Redirects the user to Spotify's authorization page
 *
 * After the user authorizes (or denies), Spotify redirects to /api/auth/callback.
 */

import { NextResponse } from "next/server";
import { env } from "@/env";
import { generatePKCE, generateRandomString, setOAuthCookies } from "@/lib/auth";

/**
 * Spotify permissions we request.
 * These determine what our app can do with the user's account.
 *
 * - playlist-read-private: Read user's private playlists
 * - playlist-read-collaborative: Include collaborative playlists
 * - playlist-modify-public: Create/edit public playlists
 * - playlist-modify-private: Create/edit private playlists
 *
 * Note: user-read-email and user-read-private scopes removed —
 * email, country, and product fields were dropped from the /me
 * response in Spotify's February 2026 API changes.
 */
const SPOTIFY_SCOPES = [
	"playlist-read-private",
	"playlist-read-collaborative",
	"playlist-modify-public",
	"playlist-modify-private",
].join(" ");

export async function GET(): Promise<NextResponse> {
	// 1. Generate PKCE pair (verifier stays secret, challenge goes to Spotify)
	const { codeVerifier, codeChallenge } = await generatePKCE();

	// 2. Generate random state for CSRF protection
	const state = generateRandomString(32);

	// 3. Store state + verifier in httpOnly cookies (consumed in callback)
	await setOAuthCookies(state, codeVerifier);

	// 4. Build Spotify authorization URL
	const params = new URLSearchParams({
		client_id: env.SPOTIFY_CLIENT_ID,
		response_type: "code",
		redirect_uri: env.SPOTIFY_REDIRECT_URI,
		scope: SPOTIFY_SCOPES,
		code_challenge_method: "S256",
		code_challenge: codeChallenge,
		state,
	});

	const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

	// 5. Redirect to Spotify
	return NextResponse.redirect(spotifyAuthUrl);
}
