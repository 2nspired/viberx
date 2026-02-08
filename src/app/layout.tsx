import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TRPCProvider } from "@/components/providers/trpc-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

/**
 * Geist Font Configuration
 *
 * Geist is a modern, clean sans-serif font designed by Vercel.
 * It's optimized for readability and works well for both UI and code.
 *
 * - geistSans: Primary font for UI text
 * - geistMono: Monospace font for code and technical data
 */
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

/**
 * App Metadata
 *
 * Defines SEO metadata, PWA configuration, and social sharing info.
 * This is used by search engines, social media, and mobile browsers.
 */
export const metadata: Metadata = {
	title: {
		default: "VibeRX - Spotify Playlist Optimizer",
		template: "%s | VibeRX",
	},
	description:
		"Optimize your Spotify playlists like a professional DJ. VibeRX analyzes BPM, key, and energy to create the perfect flow.",
	keywords: [
		"spotify",
		"playlist",
		"optimizer",
		"dj",
		"bpm",
		"mixing",
		"harmonic",
		"camelot",
		"music",
	],
	authors: [{ name: "VibeRX" }],
	creator: "VibeRX",
	manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
		title: "VibeRX",
	},
	formatDetection: {
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://viberx.app",
		siteName: "VibeRX",
		title: "VibeRX - Spotify Playlist Optimizer",
		description:
			"Optimize your Spotify playlists like a professional DJ. Analyze BPM, key, and energy for the perfect flow.",
	},
	twitter: {
		card: "summary_large_image",
		title: "VibeRX - Spotify Playlist Optimizer",
		description: "Optimize your Spotify playlists like a professional DJ.",
	},
	robots: {
		index: true,
		follow: true,
	},
};

/**
 * Viewport Configuration
 *
 * Optimized for mobile PWA experience with:
 * - Custom theme color matching our brand
 * - User-scalable for accessibility
 * - Viewport-fit cover for notched devices
 */
export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#7c3aed" },
		{ media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
	],
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	viewportFit: "cover",
};

/**
 * Root Layout Component
 *
 * This is the root layout for the entire application.
 * It wraps all pages and provides:
 * - Font configuration
 * - Theme (dark mode)
 * - tRPC provider for API calls
 * - Toast notifications
 * - Vercel Analytics
 */
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<head>
				{/* PWA Meta Tags */}
				<link rel="icon" href="/icons/icon-192x192.svg" type="image/svg+xml" />
				<link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
				<meta name="apple-mobile-web-app-title" content="VibeRX" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
			>
				<TRPCProvider>
					{children}
					<Toaster position="bottom-center" richColors closeButton />
				</TRPCProvider>
				{/* Vercel Analytics - automatically tracks page views and web vitals */}
				<Analytics />
			</body>
		</html>
	);
}
