import type { NextConfig } from "next";

/**
 * Import env to validate environment variables at build time
 * This will throw an error if any required variables are missing
 * @see src/env.ts for the schema definition
 */
import "./src/env";

/**
 * Next.js Configuration
 *
 * This configuration handles:
 * - Image optimization for Spotify album art
 * - Build optimizations
 * - Environment variable validation
 *
 * Note: PWA service worker will be added in Checkpoint 9
 */
const nextConfig: NextConfig = {
	/**
	 * Image Optimization
	 *
	 * Allow images from Spotify CDN for album art and user avatars.
	 * Using remotePatterns is more secure than domains.
	 */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.scdn.co",
				pathname: "/image/**",
			},
			{
				protocol: "https",
				hostname: "mosaic.scdn.co",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "platform-lookaside.fbsbx.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "*.spotifycdn.com",
				pathname: "/**",
			},
		],
	},

	/**
	 * Typed Routes
	 * Enable typed routes for better type safety with Links and router
	 */
	typedRoutes: true,

	/**
	 * Compiler Options
	 */
	compiler: {
		// Remove console.log in production
		removeConsole: process.env.NODE_ENV === "production",
	},

	/**
	 * Headers for security and PWA
	 */
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
				],
			},
		];
	},
};

export default nextConfig;
