/**
 * tRPC Server Initialization
 *
 * This file initializes the tRPC server with:
 * - Context creation (database access, session info)
 * - Base procedure definitions
 * - Authentication middleware (protectedProcedure)
 *
 * Architecture:
 * - tRPC provides end-to-end type safety between client and server
 * - Procedures are like API endpoints but with full TypeScript inference
 * - Context is created for each request and passed to all procedures
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Session } from "@/types/auth";

/**
 * Context type for tRPC procedures
 * This is available in every procedure and contains:
 * - prisma: Database client for all database operations
 * - session: User session from httpOnly cookies (null if not logged in)
 */
export interface Context {
	prisma: typeof prisma;
	session: Session | null;
}

/**
 * Creates the context for each tRPC request.
 * Called once per request. Reads the session from cookies.
 */
export const createContext = async (): Promise<Context> => {
	const session = await getSession();
	return {
		prisma,
		session,
	};
};

/**
 * Initialize tRPC with our context and transformer
 * superjson allows us to send Dates, Maps, Sets, etc. over the wire
 */
const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter: ({ shape, error }) => {
		return {
			...shape,
			data: {
				...shape.data,
				// Include additional error info in development
				...(process.env.NODE_ENV === "development" && {
					stack: error.stack,
				}),
			},
		};
	},
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

/**
 * Protected procedure (requires authentication)
 *
 * Checks that a valid session exists in the context.
 * If not, throws an UNAUTHORIZED error (401).
 *
 * The middleware narrows the session type from `Session | null` to `Session`,
 * so procedures using protectedProcedure get full type safety without null checks:
 *
 *   protectedProcedure.query(({ ctx }) => {
 *     ctx.session.user.id  // TS knows this is not null
 *   })
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session?.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session, // Narrowed: Session (not Session | null)
		},
	});
});
