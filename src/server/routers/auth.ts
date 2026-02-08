/**
 * Auth Router
 *
 * tRPC endpoints for authentication-related queries.
 * The actual OAuth flow uses route handlers (not tRPC) because
 * OAuth requires HTTP redirects. This router provides data queries
 * for the client to check auth status and fetch user data.
 */

import { protectedProcedure, publicProcedure, router } from "@/server/trpc/init";

export const authRouter = router({
	/**
	 * Get the current session.
	 * Returns the session if logged in, null otherwise.
	 *
	 * Uses publicProcedure (not protected) because we want to return null
	 * for unauthenticated users, not throw an error. This lets the client
	 * conditionally render login/logout UI.
	 */
	getSession: publicProcedure.query(({ ctx }) => {
		return ctx.session;
	}),

	/**
	 * Get the current authenticated user's full profile from the database.
	 * Includes user preferences.
	 *
	 * Throws UNAUTHORIZED if not logged in (uses protectedProcedure).
	 */
	getMe: protectedProcedure.query(async ({ ctx }) => {
		const user = await ctx.prisma.user.findUnique({
			where: { id: ctx.session.user.id },
			include: { preferences: true },
		});

		return user;
	}),
});
