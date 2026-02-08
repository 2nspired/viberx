/**
 * Token Refresh Route
 *
 * POST /api/auth/refresh
 *
 * Refreshes the Spotify access token using the stored refresh token.
 * Called automatically by the Spotify API client when the token is expired,
 * and can also be called directly from the client.
 *
 * Returns:
 * - 200 { success: true } on successful refresh
 * - 401 if no refresh token or Spotify rejects the refresh
 * - 500 on unexpected errors
 */

import { NextResponse } from "next/server";
import { env } from "@/env";
import { getRefreshToken, updateAccessTokenCookie } from "@/lib/auth";
import type { SpotifyTokenResponse } from "@/types/auth";

export async function POST(): Promise<NextResponse> {
	// 1. Get refresh token from cookies
	const refreshToken = await getRefreshToken();
	if (!refreshToken) {
		return NextResponse.json({ error: "No refresh token found" }, { status: 401 });
	}

	// 2. Request new access token from Spotify
	try {
		const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: refreshToken,
				client_id: env.SPOTIFY_CLIENT_ID,
				client_secret: env.SPOTIFY_CLIENT_SECRET,
			}),
		});

		if (!tokenResponse.ok) {
			const errorBody = await tokenResponse.text();
			console.error("Token refresh failed:", tokenResponse.status, errorBody);
			return NextResponse.json({ error: "Token refresh failed" }, { status: 401 });
		}

		const tokens = (await tokenResponse.json()) as SpotifyTokenResponse;

		// 3. Update cookies with new access token (and refresh token if rotated)
		await updateAccessTokenCookie({
			accessToken: tokens.access_token,
			expiresIn: tokens.expires_in,
			refreshToken: tokens.refresh_token,
		});

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error("Token refresh error:", err);
		return NextResponse.json({ error: "Token refresh failed" }, { status: 500 });
	}
}
