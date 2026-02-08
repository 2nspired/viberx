/**
 * Spotify API Client
 *
 * Authenticated client for making Spotify Web API calls.
 * Handles automatic token refresh when the access token expires.
 *
 * This module is server-side only -- it reads tokens from httpOnly cookies.
 *
 * Usage:
 *   import { spotifyFetch, getCurrentUserProfile } from '@/lib/spotify'
 *   const profile = await getCurrentUserProfile()
 */

import { env } from "@/env";
import { getRefreshToken, getSession, isTokenExpired, updateAccessTokenCookie } from "@/lib/auth";
import type { SpotifyTokenResponse } from "@/types/auth";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

// ============================================
// Token Refresh
// ============================================

/**
 * Refresh the access token server-side using the stored refresh token.
 * Updates the access token cookie and returns the new token.
 *
 * @returns New access token string, or null if refresh failed
 */
async function refreshAccessToken(): Promise<string | null> {
	const refreshToken = await getRefreshToken();
	if (!refreshToken) return null;

	try {
		const response = await fetch(SPOTIFY_TOKEN_URL, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: refreshToken,
				client_id: env.SPOTIFY_CLIENT_ID,
				client_secret: env.SPOTIFY_CLIENT_SECRET,
			}),
		});

		if (!response.ok) {
			console.error("Token refresh failed:", response.status, await response.text());
			return null;
		}

		const tokens = (await response.json()) as SpotifyTokenResponse;

		// Update cookies with new access token (and refresh token if rotated)
		await updateAccessTokenCookie({
			accessToken: tokens.access_token,
			expiresIn: tokens.expires_in,
			refreshToken: tokens.refresh_token,
		});

		return tokens.access_token;
	} catch (error) {
		console.error("Token refresh error:", error);
		return null;
	}
}

// ============================================
// Authenticated Fetch
// ============================================

/**
 * Make an authenticated request to the Spotify API.
 *
 * Handles token lifecycle automatically:
 * 1. Proactive refresh: checks if token is expired/expiring before the request
 * 2. Reactive refresh: retries once on 401 with a fresh token
 *
 * @param endpoint - API path after /v1 (e.g., "/me", "/me/playlists")
 *                   or a full URL for paginated results
 * @param options - Standard fetch options (method, body, headers, etc.)
 * @returns The raw Response object (caller handles parsing)
 * @throws Error if no session exists or both refresh attempts fail
 */
export async function spotifyFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
	let session = await getSession();

	if (!session) {
		// Try refreshing -- access token cookie may have expired but refresh token exists
		const newToken = await refreshAccessToken();
		if (!newToken) {
			throw new Error("No active session");
		}
		session = await getSession();
		if (!session) {
			throw new Error("No active session after refresh");
		}
	}

	// Proactively refresh if token is about to expire (within 5 minutes)
	let { accessToken } = session;
	if (await isTokenExpired()) {
		const newToken = await refreshAccessToken();
		if (newToken) {
			accessToken = newToken;
		}
	}

	const url = endpoint.startsWith("http") ? endpoint : `${SPOTIFY_API_BASE}${endpoint}`;

	let response = await fetch(url, {
		...options,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	// Reactive refresh: if we still get a 401, try one more time
	if (response.status === 401) {
		const newToken = await refreshAccessToken();
		if (!newToken) {
			throw new Error("Token refresh failed");
		}

		response = await fetch(url, {
			...options,
			headers: {
				Authorization: `Bearer ${newToken}`,
				"Content-Type": "application/json",
				...options.headers,
			},
		});
	}

	return response;
}

// ============================================
// Convenience Methods
// ============================================

/**
 * Get the current user's Spotify profile.
 * Used after login and on the dashboard.
 */
export async function getCurrentUserProfile() {
	const response = await spotifyFetch("/me");
	if (!response.ok) {
		throw new Error(`Failed to fetch profile: ${response.status}`);
	}
	return response.json();
}

/**
 * Get the current user's playlists (paginated).
 * Spotify returns max 50 playlists per request.
 *
 * @param limit - Number of playlists per page (max 50)
 * @param offset - Offset for pagination
 */
export async function getUserPlaylists(limit = 50, offset = 0) {
	const response = await spotifyFetch(`/me/playlists?limit=${limit}&offset=${offset}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch playlists: ${response.status}`);
	}
	return response.json();
}
