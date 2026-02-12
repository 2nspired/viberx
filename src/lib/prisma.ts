/**
 * Prisma Client Singleton
 *
 * This file exports a singleton instance of Prisma Client to prevent
 * multiple instances during development (hot reloading creates new instances).
 *
 * In production, this pattern ensures a single database connection pool.
 *
 * Usage:
 *   import { prisma } from '@/lib/prisma'
 *   const users = await prisma.user.findMany()
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// The Prisma Client is generated at node_modules/.prisma/client
// Run `npm run db:generate` after schema changes to regenerate

// Declare global type for the Prisma client singleton
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

// Create a single instance of Prisma Client
// In development, we store it in globalThis to survive hot reloads
// In production, we just create a new instance
function createPrismaClient() {
	const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" });
	return new PrismaClient({
		adapter,
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
	});
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Prevent multiple instances in development
if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export default prisma;
