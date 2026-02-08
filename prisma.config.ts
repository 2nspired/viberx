/**
 * Prisma Configuration (Prisma 7+)
 *
 * This configuration file manages database connections and CLI settings.
 * In Prisma 7, the datasource URL is configured here instead of schema.prisma.
 *
 * @see https://pris.ly/prisma-config
 */

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
	// Schema file location
	schema: "prisma/schema.prisma",

	// Migrations configuration
	migrations: {
		// Migrations directory
		path: "prisma/migrations",
		// Seed command
		seed: "npx tsx prisma/seed.ts",
	},

	// Database connection
	// Use DIRECT_URL for migrations/push (bypasses PgBouncer)
	// PgBouncer doesn't support all operations needed for schema changes
	datasource: {
		url: env("DIRECT_URL"),
	},
});
