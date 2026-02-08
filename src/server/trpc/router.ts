/**
 * Root tRPC Router
 *
 * This file combines all tRPC routers into a single root router.
 * The root router is used to:
 * - Create the API handler for Next.js
 * - Generate the type for the client
 *
 * Add new routers here as you build features:
 * - healthRouter: System health checks
 * - authRouter: Authentication queries
 * - playlistsRouter: Spotify playlist operations (Checkpoint 4)
 */

import { authRouter } from "@/server/routers/auth";
import { healthRouter } from "@/server/routers/health";
import { createCallerFactory, router } from "@/server/trpc/init";

/**
 * Root router containing all sub-routers
 * Each sub-router handles a specific domain of the application
 */
export const appRouter = router({
	health: healthRouter,
	auth: authRouter,
	// playlists: playlistsRouter, // Checkpoint 4
	// optimization: optimizationRouter, // Checkpoint 6
});

/**
 * Export type definition of the entire API
 * This is used by the client to get full type inference
 */
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the router
 * Useful for calling tRPC procedures from Server Components
 */
export const createCaller = createCallerFactory(appRouter);
