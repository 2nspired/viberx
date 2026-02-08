/**
 * Logout Route
 *
 * POST /api/auth/logout
 *
 * Clears all auth cookies, ending the user's session.
 * The client should redirect to the home page after calling this.
 *
 * Returns JSON (not a redirect) so the client has control over
 * post-logout behavior (e.g., showing a toast before redirecting).
 */

import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth";

export async function POST(): Promise<NextResponse> {
	await clearAuthCookies();
	return NextResponse.json({ success: true });
}
