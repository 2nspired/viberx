"use client";

/**
 * tRPC Provider Component
 *
 * This provider wraps the application and sets up:
 * - React Query client for caching and state management
 * - tRPC client for API communication
 *
 * Must be used as a client component ("use client") because
 * React Query and tRPC hooks require client-side state.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { getBaseUrl, trpc } from "@/lib/trpc";

interface TRPCProviderProps {
	children: React.ReactNode;
}

export function TRPCProvider({ children }: TRPCProviderProps) {
	// Create clients once using useState to persist across re-renders
	// This prevents creating new clients on every render
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// Don't refetch on window focus in development
						refetchOnWindowFocus: process.env.NODE_ENV === "production",
						// Stale time of 1 minute
						staleTime: 60 * 1000,
						// Retry failed requests once
						retry: 1,
					},
				},
			})
	);

	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					url: `${getBaseUrl()}/api/trpc`,
					// Use superjson for data transformation
					transformer: superjson,
					// Headers can be used for authentication tokens in the future
					headers() {
						return {
							// Add custom headers here if needed
						};
					},
				}),
			],
		})
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
}
