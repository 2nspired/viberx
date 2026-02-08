/**
 * tRPC Client Configuration
 *
 * This file sets up the tRPC client for use in React components.
 * It provides full type safety when calling API procedures.
 *
 * Usage in components:
 *   import { trpc } from '@/lib/trpc'
 *
 *   // In a component:
 *   const { data } = trpc.health.check.useQuery()
 *   const mutation = trpc.playlists.create.useMutation()
 */

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/trpc/router";

/**
 * Create the tRPC React client
 * This gives us hooks like useQuery and useMutation
 * with full type inference from our router
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Helper to get the base URL for API calls
 * Works in both browser and server environments
 */
export function getBaseUrl() {
	if (typeof window !== "undefined") {
		// Browser should use relative path
		return "";
	}

	// SSR should use absolute URL
	// Check for Vercel deployment first
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	// Fallback to localhost for development
	return `http://localhost:${process.env.PORT ?? 3000}`;
}
