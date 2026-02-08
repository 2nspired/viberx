/**
 * Health Check Router
 *
 * Provides endpoints for checking application health and connectivity.
 * Useful for monitoring and debugging.
 */

import { publicProcedure, router } from "@/server/trpc/init";

export const healthRouter = router({
	/**
	 * Basic health check - returns ok if the server is running
	 */
	check: publicProcedure.query(() => {
		return {
			status: "ok",
			timestamp: new Date(),
			environment: process.env.NODE_ENV,
		};
	}),

	/**
	 * Database health check - verifies Prisma connection
	 * Useful for debugging database connectivity issues
	 */
	database: publicProcedure.query(async ({ ctx }) => {
		try {
			// Simple query to test database connection
			await ctx.prisma.$queryRaw`SELECT 1`;
			return {
				status: "connected",
				timestamp: new Date(),
			};
		} catch (error) {
			return {
				status: "disconnected",
				timestamp: new Date(),
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}),
});
