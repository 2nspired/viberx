/**
 * Next.js Middleware
 *
 * Runs before every request to handle route protection:
 * - Protected routes (/dashboard, etc.) redirect to /login if not authenticated
 * - Auth routes (/login) redirect to /dashboard if already authenticated
 * - Public routes (/, /api/auth, etc.) pass through unchanged
 *
 * Note: Middleware runs on the Edge Runtime, so it can only read cookies
 * (no Node.js APIs, no database access). Actual token validation happens
 * in the route handlers and tRPC context.
 *
 * We check for BOTH access_token and refresh_token cookies because:
 * - access_token expires after 1 hour
 * - refresh_token lasts 30 days
 * - If only refresh_token exists, the user is still "authenticated" --
 *   the actual page/API will refresh the token
 */

import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Skip middleware for routes that should always be accessible
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api/auth") ||
		pathname.startsWith("/api/trpc") ||
		pathname.startsWith("/admin") ||
		pathname === "/"
	) {
		return NextResponse.next();
	}

	// Check for auth cookies (access OR refresh token = authenticated)
	const accessToken = request.cookies.get("viberx_access_token")?.value;
	const refreshToken = request.cookies.get("viberx_refresh_token")?.value;
	const isAuthenticated = !!accessToken || !!refreshToken;

	// Protected routes: redirect to login if not authenticated
	if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
		if (!isAuthenticated) {
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("callbackUrl", pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	// Auth routes: redirect to dashboard if already authenticated
	if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
		if (isAuthenticated) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	// Match all routes except static files
	matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)"],
};
