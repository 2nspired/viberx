/**
 * Environment Variable Validation
 *
 * This file uses T3 Env to validate all environment variables at build time.
 * If any required variable is missing or invalid, the build will fail with
 * a clear error message.
 *
 * Benefits:
 * - Type-safe access to env vars throughout the app
 * - Build-time validation catches missing vars before deployment
 * - Clear separation between server and client variables
 * - Runtime validation in development
 *
 * Usage:
 *   import { env } from '@/env'
 *   console.log(env.DATABASE_URL) // Type-safe, validated
 *
 * @see https://env.t3.gg/docs/nextjs
 */

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Server-side environment variables
	 * These are only available on the server and never exposed to the client.
	 * Perfect for secrets like API keys and database URLs.
	 */
	server: {
		// Database
		DATABASE_URL: z
			.string()
			.regex(/^postgres(ql)?:\/\/.+/, "DATABASE_URL must be a valid PostgreSQL connection string"),
		DIRECT_URL: z
			.string()
			.regex(/^postgres(ql)?:\/\/.+/, "DIRECT_URL must be a valid PostgreSQL connection string")
			.optional(),

		// Spotify OAuth
		SPOTIFY_CLIENT_ID: z.string().min(1, "SPOTIFY_CLIENT_ID is required"),
		SPOTIFY_CLIENT_SECRET: z.string().min(1, "SPOTIFY_CLIENT_SECRET is required"),
		SPOTIFY_REDIRECT_URI: z.string().refine(
			(val) => {
				try {
					new URL(val);
					return true;
				} catch {
					return false;
				}
			},
			{ message: "SPOTIFY_REDIRECT_URI must be a valid URL" }
		),

		// Authentication
		AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters for security"),

		// Admin (development only)
		ADMIN_PASSWORD: z.string().min(1).optional(),

		// Node environment
		NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
	},

	/**
	 * Client-side environment variables
	 * These are exposed to the browser via Next.js NEXT_PUBLIC_ prefix.
	 * Never put secrets here!
	 */
	client: {
		// Currently no client-side env vars needed
		// Example: NEXT_PUBLIC_APP_URL: z.string().url(),
	},

	/**
	 * Runtime environment mapping
	 * For Next.js, we need to explicitly map each variable.
	 * This ensures only referenced variables are bundled.
	 */
	runtimeEnv: {
		// Server
		DATABASE_URL: process.env.DATABASE_URL,
		DIRECT_URL: process.env.DIRECT_URL,
		SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
		SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
		SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
		AUTH_SECRET: process.env.AUTH_SECRET,
		ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
		NODE_ENV: process.env.NODE_ENV,
		// Client (none currently)
	},

	/**
	 * Skip validation in certain environments
	 * Useful for Docker builds where env vars aren't available yet
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,

	/**
	 * Treat empty strings as undefined
	 * Prevents issues with .env files that have empty values
	 */
	emptyStringAsUndefined: true,
});
