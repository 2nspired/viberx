/**
 * Authentication Types
 *
 * Shared TypeScript types for the Spotify OAuth flow,
 * session management, and Spotify API responses.
 */

/**
 * User data stored in the session cookie.
 * This is a subset of the full User model in the database --
 * just enough to render the UI without a DB query on every request.
 */
export interface SessionUser {
	id: string;
	displayName: string | null;
	profileImage: string | null;
}

/**
 * Assembled session from auth cookies.
 * Not stored in a single cookie -- built from multiple httpOnly cookies.
 */
export interface Session {
	user: SessionUser;
	accessToken: string;
	expiresAt: number; // Unix timestamp (ms) when access_token expires
}

/**
 * Response from Spotify's /api/token endpoint.
 * Returned on both initial authorization and token refresh.
 *
 * @see https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 */
export interface SpotifyTokenResponse {
	access_token: string;
	token_type: string;
	scope: string;
	expires_in: number; // seconds (typically 3600 = 1 hour)
	refresh_token?: string; // present on initial auth, may be rotated on refresh
}

/**
 * Spotify user profile from /v1/me endpoint.
 * Note: email, country, product fields were removed in Feb 2026 API changes.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
 */
export interface SpotifyUserProfile {
	id: string;
	display_name: string | null;
	images: Array<{ url: string; height: number | null; width: number | null }>;
}
