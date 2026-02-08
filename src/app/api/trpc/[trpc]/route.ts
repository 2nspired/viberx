/**
 * tRPC API Route Handler
 *
 * This file creates the Next.js API route that handles all tRPC requests.
 * The [trpc] dynamic segment allows tRPC to handle multiple endpoints
 * through a single route.
 *
 * How it works:
 * 1. Client makes request to /api/trpc/[procedureName]
 * 2. This handler receives the request
 * 3. tRPC routes it to the correct procedure
 * 4. Response is sent back with full type safety
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "@/server/trpc/init";
import { appRouter } from "@/server/trpc/router";

/**
 * Request handler for both GET and POST requests
 * tRPC uses:
 * - GET for queries (fetching data)
 * - POST for mutations (modifying data)
 */
const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext,
		onError:
			process.env.NODE_ENV === "development"
				? ({ path, error }) => {
						console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
					}
				: undefined,
	});

export { handler as GET, handler as POST };
