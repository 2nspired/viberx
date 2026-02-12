/**
 * Prisma Configuration (Prisma 7+)
 *
 * This configuration file manages database connections and CLI settings.
 * In Prisma 7, the datasource URL is configured here instead of schema.prisma.
 *
 * @see https://pris.ly/prisma-config
 */

import "dotenv/config";
import { defineConfig } from "prisma/config";

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
	// Prefer DIRECT_URL for migrations/push (bypasses PgBouncer)
	// Fall back to DATABASE_URL for environments where DIRECT_URL isn't set (e.g. Vercel builds)
	datasource: {
		url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
	},
});
