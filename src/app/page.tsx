/**
 * VibeRX Landing Page
 *
 * Industrial minimalism aesthetic:
 * - Squared geometry, neutral palette
 * - Feature cards in prescription-label style
 * - Example audio metrics display
 * - Fully responsive (mobile-first)
 */

import { Music, Zap } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	RxLabel,
	RxValue,
} from "@/components/ui/card";
import { DosageBar } from "@/components/ui/progress";

export default function HomePage() {
	return (
		<main className="min-h-screen">
			{/* Hero Section */}
			<section className="px-4 py-20 md:py-32">
				<div className="mx-auto max-w-4xl text-center">
					{/* Badge */}
					<Badge variant="outline" className="mb-6 font-mono uppercase tracking-wider">
						Your Playlist Prescription
					</Badge>

					{/* Main Heading */}
					<h1 className="mb-6 text-5xl font-bold uppercase tracking-tight md:text-7xl">
						VIBE<span className="text-vibe-cyan">RX</span>
					</h1>

					{/* Tagline */}
					<p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground md:text-xl">
						Optimize your Spotify playlists like a professional DJ. Analyze BPM, key, and energy for
						the perfect flow.
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button size="xl" variant="default" className="min-w-[200px]" asChild>
							<Link href="/login">
								<Music className="size-5" />
								Connect Spotify
							</Link>
						</Button>
						<Button size="xl" variant="outline" className="min-w-[200px]" asChild>
							<Link href="/admin/design-system">View Design System</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="px-4 py-16 md:py-24">
				<div className="mx-auto max-w-6xl">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
						<p className="text-muted-foreground">Three simple steps to the perfect playlist flow</p>
					</div>

					<div className="grid gap-6 md:grid-cols-3">
						{/* Step 1 */}
						<Card variant="rx">
							<CardHeader>
								<div className="mb-2 flex size-10 items-center justify-center rounded-sm bg-muted text-foreground">
									<span className="font-mono text-lg font-bold">1</span>
								</div>
								<CardTitle>Analyze</CardTitle>
								<CardDescription>
									We scan your playlist for BPM, musical key, and energy levels for every track.
								</CardDescription>
							</CardHeader>
						</Card>

						{/* Step 2 */}
						<Card variant="rx">
							<CardHeader>
								<div className="mb-2 flex size-10 items-center justify-center rounded-sm bg-muted text-foreground">
									<span className="font-mono text-lg font-bold">2</span>
								</div>
								<CardTitle>Optimize</CardTitle>
								<CardDescription>
									Our algorithm reorders tracks for smooth BPM transitions and harmonic mixing.
								</CardDescription>
							</CardHeader>
						</Card>

						{/* Step 3 */}
						<Card variant="rx">
							<CardHeader>
								<div className="mb-2 flex size-10 items-center justify-center rounded-sm bg-muted text-foreground">
									<span className="font-mono text-lg font-bold">3</span>
								</div>
								<CardTitle>Save</CardTitle>
								<CardDescription>
									Export your optimized playlist back to Spotify with one click.
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>
			</section>

			{/* Example Card Section */}
			<section className="px-4 py-16 md:py-24">
				<div className="mx-auto max-w-2xl">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
							Prescription Preview
						</h2>
						<p className="text-muted-foreground">See how your tracks are analyzed</p>
					</div>

					{/* Example Track Card */}
					<Card variant="rx" className="overflow-hidden">
						<CardHeader className="border-b border-border pb-4">
							<div className="flex items-start justify-between">
								<div>
									<RxLabel>Track Analysis</RxLabel>
									<CardTitle className="mt-1 text-xl">Midnight City</CardTitle>
									<CardDescription>M83 • Hurry Up, We're Dreaming</CardDescription>
								</div>
								<Badge variant="energy-medium">Medium Energy</Badge>
							</div>
						</CardHeader>

						<CardContent className="pt-6">
							{/* Metrics Grid */}
							<div className="mb-6 grid grid-cols-3 gap-4 text-center">
								<div>
									<RxLabel>BPM</RxLabel>
									<RxValue className="text-vibe-purple">105</RxValue>
								</div>
								<div>
									<RxLabel>Key</RxLabel>
									<RxValue className="text-vibe-cyan">G maj</RxValue>
								</div>
								<div>
									<RxLabel>Duration</RxLabel>
									<RxValue>4:03</RxValue>
								</div>
							</div>

							{/* Audio Features */}
							<div className="space-y-4">
								<DosageBar label="Energy" value={78} variant="energy" />
								<DosageBar label="Danceability" value={65} variant="cyan" />
								<DosageBar label="Valence" value={56} variant="pink" />
							</div>

							{/* Compatibility */}
							<div className="mt-6 flex items-center justify-between rounded-sm bg-muted/50 p-3">
								<div className="flex items-center gap-2">
									<Zap className="size-4 text-key-compatible" />
									<span className="text-sm">Next track compatibility</span>
								</div>
								<Badge variant="key-compatible">Harmonic Match</Badge>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Bottom CTA */}
			<section className="px-4 py-16 md:py-24">
				<div className="mx-auto max-w-xl text-center">
					<h2 className="mb-4 text-2xl font-bold md:text-3xl">Ready to optimize?</h2>
					<p className="mb-8 text-muted-foreground">
						Connect your Spotify account and start creating the perfect flow.
					</p>
					<Button size="xl" variant="default" asChild>
						<Link href="/login">
							<Music className="size-5" />
							Get Started Free
						</Link>
					</Button>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-border px-4 py-8">
				<div className="mx-auto max-w-6xl">
					<div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
						<div className="flex items-center gap-2">
							<span className="font-bold uppercase text-foreground">
								VIBE<span className="text-vibe-cyan">RX</span>
							</span>
							<span>• Phase 1 MVP</span>
						</div>
						<div className="flex gap-6">
							<Link href="/admin/design-system" className="hover:text-foreground transition-colors">
								Design System
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</main>
	);
}
