/**
 * Authentication Utilities
 *
 * Core module for Spotify OAuth with PKCE:
 * - PKCE code verifier/challenge generation
 * - Cookie management (set, read, clear)
 * - Session reading from cookies
 *
 * All tokens are stored in httpOnly cookies for security.
 * This module is server-side only (uses `cookies()` from next/headers).
 */

import { cookies } from "next/headers";
import type { Session, SessionUser } from "@/types/auth";

// ============================================
// Cookie Names
// ============================================

export const COOKIE_NAMES = {
	ACCESS_TOKEN: "viberx_access_token",
	REFRESH_TOKEN: "viberx_refresh_token",
	TOKEN_EXPIRES_AT: "viberx_token_expires_at",
	USER: "viberx_user",
	OAUTH_STATE: "viberx_oauth_state",
	CODE_VERIFIER: "viberx_code_verifier",
} as const;

// ============================================
// Cookie Options
// ============================================

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS_BASE = {
	httpOnly: true,
	secure: IS_PRODUCTION,
	sameSite: "lax" as const,
	path: "/",
};

// 30 days (refresh tokens are long-lived)
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60;

// 10 minutes (temporary OAuth flow cookies)
const OAUTH_COOKIE_MAX_AGE = 600;

// ============================================
// PKCE Utilities
// ============================================

/**
 * Generate a cryptographically random string for PKCE code verifier or state.
 * Uses Web Crypto API (available in both Node.js and Edge runtimes).
 *
 * @param length - Desired string length (default 128 for code verifier, 32 for state)
 * @returns URL-safe random string
 */
export function generateRandomString(length: number): string {
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
	const randomValues = crypto.getRandomValues(new Uint8Array(length));
	return Array.from(randomValues, (v) => possible[v % possible.length]).join("");
}

/**
 * Generate the SHA-256 code challenge from a code verifier.
 * Required for PKCE flow: the challenge is sent to Spotify during authorization,
 * and the verifier is sent during token exchange to prove we initiated the flow.
 *
 * @param codeVerifier - The plain-text code verifier
 * @returns Base64url-encoded SHA-256 hash
 */
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);
	const digest = await crypto.subtle.digest("SHA-256", data);

	// Convert to base64url encoding (URL-safe, no padding)
	return btoa(String.fromCharCode(...new Uint8Array(digest)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

/**
 * Generate a complete PKCE pair (verifier + challenge).
 *
 * @returns Object with codeVerifier (128 chars) and codeChallenge (SHA-256 hash)
 */
export async function generatePKCE(): Promise<{
	codeVerifier: string;
	codeChallenge: string;
}> {
	const codeVerifier = generateRandomString(128);
	const codeChallenge = await generateCodeChallenge(codeVerifier);
	return { codeVerifier, codeChallenge };
}

// ============================================
// OAuth Cookie Management (temporary, during flow)
// ============================================

/**
 * Set temporary cookies for the OAuth flow.
 * These are consumed (read + deleted) when the callback is received.
 */
export async function setOAuthCookies(state: string, codeVerifier: string): Promise<void> {
	const cookieStore = await cookies();

	cookieStore.set(COOKIE_NAMES.OAUTH_STATE, state, {
		...COOKIE_OPTIONS_BASE,
		maxAge: OAUTH_COOKIE_MAX_AGE,
	});

	cookieStore.set(COOKIE_NAMES.CODE_VERIFIER, codeVerifier, {
		...COOKIE_OPTIONS_BASE,
		maxAge: OAUTH_COOKIE_MAX_AGE,
	});
}

/**
 * Read and delete the temporary OAuth cookies.
 * Called in the callback handler after Spotify redirects back.
 *
 * @returns The state and codeVerifier, or null if cookies are missing/expired
 */
export async function consumeOAuthCookies(): Promise<{
	state: string;
	codeVerifier: string;
} | null> {
	const cookieStore = await cookies();

	const state = cookieStore.get(COOKIE_NAMES.OAUTH_STATE)?.value;
	const codeVerifier = cookieStore.get(COOKIE_NAMES.CODE_VERIFIER)?.value;

	// Clear temporary cookies immediately (one-time use)
	cookieStore.delete(COOKIE_NAMES.OAUTH_STATE);
	cookieStore.delete(COOKIE_NAMES.CODE_VERIFIER);

	if (!state || !codeVerifier) {
		return null;
	}

	return { state, codeVerifier };
}

// ============================================
// Auth Cookie Management (persistent session)
// ============================================

/**
 * Set all auth cookies after successful login or token exchange.
 * Called from the callback handler with tokens and user profile.
 */
export async function setAuthCookies(params: {
	accessToken: string;
	refreshToken: string;
	expiresIn: number; // seconds from now
	user: SessionUser;
}): Promise<void> {
	const cookieStore = await cookies();
	const expiresAt = Date.now() + params.expiresIn * 1000;

	cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, params.accessToken, {
		...COOKIE_OPTIONS_BASE,
		maxAge: params.expiresIn,
	});

	cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, params.refreshToken, {
		...COOKIE_OPTIONS_BASE,
		maxAge: REFRESH_TOKEN_MAX_AGE,
	});

	cookieStore.set(COOKIE_NAMES.TOKEN_EXPIRES_AT, String(expiresAt), {
		...COOKIE_OPTIONS_BASE,
		maxAge: params.expiresIn,
	});

	cookieStore.set(COOKIE_NAMES.USER, JSON.stringify(params.user), {
		...COOKIE_OPTIONS_BASE,
		maxAge: REFRESH_TOKEN_MAX_AGE,
	});
}

/**
 * Update just the access token cookie (used during token refresh).
 * Also updates the refresh token if Spotify rotated it.
 */
export async function updateAccessTokenCookie(params: {
	accessToken: string;
	expiresIn: number;
	refreshToken?: string;
}): Promise<void> {
	const cookieStore = await cookies();
	const expiresAt = Date.now() + params.expiresIn * 1000;

	cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, params.accessToken, {
		...COOKIE_OPTIONS_BASE,
		maxAge: params.expiresIn,
	});

	cookieStore.set(COOKIE_NAMES.TOKEN_EXPIRES_AT, String(expiresAt), {
		...COOKIE_OPTIONS_BASE,
		maxAge: params.expiresIn,
	});

	// Update refresh token if Spotify rotated it
	if (params.refreshToken) {
		cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, params.refreshToken, {
			...COOKIE_OPTIONS_BASE,
			maxAge: REFRESH_TOKEN_MAX_AGE,
		});
	}
}

/**
 * Clear all auth cookies (logout).
 */
export async function clearAuthCookies(): Promise<void> {
	const cookieStore = await cookies();

	cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
	cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
	cookieStore.delete(COOKIE_NAMES.TOKEN_EXPIRES_AT);
	cookieStore.delete(COOKIE_NAMES.USER);
}

// ============================================
// Session Reading
// ============================================

/**
 * Get the current session from cookies.
 * Returns null if no valid session exists (user not logged in).
 *
 * This does NOT refresh tokens -- callers should check isTokenExpired()
 * and refresh separately if needed.
 */
export async function getSession(): Promise<Session | null> {
	const cookieStore = await cookies();

	const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
	const userJson = cookieStore.get(COOKIE_NAMES.USER)?.value;
	const expiresAtStr = cookieStore.get(COOKIE_NAMES.TOKEN_EXPIRES_AT)?.value;

	// If we have no access token but have a refresh token, the session
	// is "expired but refreshable". We still return null here --
	// the middleware or spotifyFetch will handle the refresh.
	if (!accessToken || !userJson) {
		return null;
	}

	try {
		const user = JSON.parse(userJson) as SessionUser;
		const expiresAt = expiresAtStr ? Number(expiresAtStr) : Date.now();

		return {
			user,
			accessToken,
			expiresAt,
		};
	} catch {
		// Corrupted user cookie
		return null;
	}
}

/**
 * Check if the access token is expired or about to expire.
 * Returns true if the token expires within the next 5 minutes.
 * Used to proactively refresh before making API calls.
 */
export async function isTokenExpired(): Promise<boolean> {
	const cookieStore = await cookies();
	const expiresAtStr = cookieStore.get(COOKIE_NAMES.TOKEN_EXPIRES_AT)?.value;

	if (!expiresAtStr) {
		return true;
	}

	const expiresAt = Number(expiresAtStr);
	const fiveMinutes = 5 * 60 * 1000;

	return Date.now() > expiresAt - fiveMinutes;
}

/**
 * Get the refresh token from cookies.
 * Used by the refresh endpoint and spotifyFetch.
 */
export async function getRefreshToken(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value ?? null;
}

/**
 * Check if the user has any auth cookies (even if access token expired).
 * Used by middleware to distinguish "never logged in" from "session expired".
 */
export async function hasAuthCookies(): Promise<boolean> {
	const cookieStore = await cookies();
	return !!(
		cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value ||
		cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value
	);
}
