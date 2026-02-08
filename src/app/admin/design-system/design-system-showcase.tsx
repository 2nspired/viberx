"use client";

import { Check, Copy, Music, Zap } from "lucide-react";
import { useState } from "react";

import { Badge, BpmBadge, EnergyBadge, KeyBadge } from "@/components/ui/badge";
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
import { BpmMeter, DosageBar, EnergyMeter, Progress } from "@/components/ui/progress";

export function DesignSystemShowcase() {
	const [copiedColor, setCopiedColor] = useState<string | null>(null);

	const copyToClipboard = (text: string, colorName: string) => {
		navigator.clipboard.writeText(text);
		setCopiedColor(colorName);
		setTimeout(() => setCopiedColor(null), 2000);
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
					<h1 className="text-xl font-bold uppercase">
						VIBE<span className="text-vibe-cyan">RX</span>
						<span className="ml-2 text-muted-foreground normal-case">Design System</span>
					</h1>
					<Badge variant="outline" size="sm" className="font-mono uppercase tracking-wider">
						Dev Mode
					</Badge>
				</div>
			</header>

			<main className="mx-auto max-w-7xl space-y-16 px-4 py-12">
				{/* Color Palette */}
				<section>
					<SectionHeader title="Color Palette" description="VibeRX brand and semantic colors" />
					<div className="space-y-8">
						{/* Brand Colors */}
						<div>
							<h3 className="mb-4 text-sm font-medium text-muted-foreground">Brand Colors</h3>
							<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
								<ColorSwatch
									name="Purple"
									variable="--vibe-purple"
									hex="#a855f7"
									className="bg-vibe-purple"
									copied={copiedColor === "purple"}
									onCopy={() => copyToClipboard("#a855f7", "purple")}
								/>
								<ColorSwatch
									name="Cyan"
									variable="--vibe-cyan"
									hex="#22d3ee"
									className="bg-vibe-cyan"
									copied={copiedColor === "cyan"}
									onCopy={() => copyToClipboard("#22d3ee", "cyan")}
								/>
								<ColorSwatch
									name="Pink"
									variable="--vibe-pink"
									hex="#ec4899"
									className="bg-vibe-pink"
									copied={copiedColor === "pink"}
									onCopy={() => copyToClipboard("#ec4899", "pink")}
								/>
								<ColorSwatch
									name="Lime"
									variable="--vibe-lime"
									hex="#84cc16"
									className="bg-vibe-lime"
									copied={copiedColor === "lime"}
									onCopy={() => copyToClipboard("#84cc16", "lime")}
								/>
								<ColorSwatch
									name="Orange"
									variable="--vibe-orange"
									hex="#f97316"
									className="bg-vibe-orange"
									copied={copiedColor === "orange"}
									onCopy={() => copyToClipboard("#f97316", "orange")}
								/>
							</div>
						</div>

						{/* Energy Colors */}
						<div>
							<h3 className="mb-4 text-sm font-medium text-muted-foreground">Energy Levels</h3>
							<div className="grid grid-cols-3 gap-4">
								<ColorSwatch
									name="Low Energy"
									variable="--energy-low"
									hex="#22d3ee"
									className="bg-energy-low"
									copied={copiedColor === "energy-low"}
									onCopy={() => copyToClipboard("#22d3ee", "energy-low")}
								/>
								<ColorSwatch
									name="Medium Energy"
									variable="--energy-medium"
									hex="#facc15"
									className="bg-energy-medium"
									copied={copiedColor === "energy-medium"}
									onCopy={() => copyToClipboard("#facc15", "energy-medium")}
								/>
								<ColorSwatch
									name="High Energy"
									variable="--energy-high"
									hex="#ef4444"
									className="bg-energy-high"
									copied={copiedColor === "energy-high"}
									onCopy={() => copyToClipboard("#ef4444", "energy-high")}
								/>
							</div>
						</div>

						{/* Key Compatibility Colors */}
						<div>
							<h3 className="mb-4 text-sm font-medium text-muted-foreground">Key Compatibility</h3>
							<div className="grid grid-cols-3 gap-4">
								<ColorSwatch
									name="Compatible"
									variable="--key-compatible"
									hex="#22c55e"
									className="bg-key-compatible"
									copied={copiedColor === "key-compatible"}
									onCopy={() => copyToClipboard("#22c55e", "key-compatible")}
								/>
								<ColorSwatch
									name="Neutral"
									variable="--key-neutral"
									hex="#eab308"
									className="bg-key-neutral"
									copied={copiedColor === "key-neutral"}
									onCopy={() => copyToClipboard("#eab308", "key-neutral")}
								/>
								<ColorSwatch
									name="Clash"
									variable="--key-clash"
									hex="#ef4444"
									className="bg-key-clash"
									copied={copiedColor === "key-clash"}
									onCopy={() => copyToClipboard("#ef4444", "key-clash")}
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Typography */}
				<section>
					<SectionHeader title="Typography" description="Font scales and text styles" />
					<Card>
						<CardContent className="space-y-6 pt-6">
							<div className="space-y-4">
								<p className="text-7xl font-bold tracking-tight">Heading 7xl</p>
								<p className="text-5xl font-bold tracking-tight">Heading 5xl</p>
								<p className="text-4xl font-bold tracking-tight">Heading 4xl</p>
								<p className="text-3xl font-bold tracking-tight">Heading 3xl</p>
								<p className="text-2xl font-bold tracking-tight">Heading 2xl</p>
								<p className="text-xl font-semibold">Heading xl</p>
								<p className="text-lg">Body Large</p>
								<p className="text-base">Body Default</p>
								<p className="text-sm text-muted-foreground">Body Small / Muted</p>
								<p className="text-xs text-muted-foreground">Caption / Extra Small</p>
							</div>
							<div className="border-t border-border pt-6">
								<h4 className="mb-4 text-sm font-medium">Special Styles</h4>
								<div className="space-y-4">
									<p className="text-4xl font-bold uppercase tracking-tight">
										VIBE<span className="text-vibe-cyan">RX</span>
									</p>
									<p className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
										Monospace / RX Label
									</p>
									<p className="font-mono text-lg font-semibold tabular-nums">128 BPM</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</section>

				{/* Buttons */}
				<section>
					<SectionHeader title="Buttons" description="All button variants, sizes, and shapes" />
					<div className="space-y-8">
						{/* Variants */}
						<div>
							<h3 className="mb-4 text-sm font-medium text-muted-foreground">Variants</h3>
							<div className="flex flex-wrap gap-4">
								<Button variant="default">Default</Button>
								<Button variant="secondary">Secondary</Button>
								<Button variant="outline">Outline</Button>
								<Button variant="ghost">Ghost</Button>
								<Button variant="link">Link</Button>
								<Button variant="destructive">Destructive</Button>
								<Button variant="cyan">Cyan</Button>
								<Button variant="pink">Pink</Button>
							</div>
						</div>

						{/* Sizes */}
						<div>
							<h3 className="mb-4 text-sm font-medium text-muted-foreground">Sizes</h3>
							<div className="flex flex-wrap items-center gap-4">
								<Button size="xs">Extra Small</Button>
								<Button size="sm">Small</Button>
								<Button size="default">Default</Button>
								<Button size="lg">Large</Button>
								<Button size="xl">Extra Large</Button>
							</div>
						</div>

						{/* Shapes */}
						<div>
							<h3 className="mb-4 text-sm font-medium text-muted-foreground">Shapes</h3>
							<div className="flex flex-wrap items-center gap-4">
								<Button shape="default">Default</Button>
								<Button shape="square">Square</Button>
								<Button variant="default" size="xl">
									<Music className="size-5" />
									Connect Spotify
								</Button>
							</div>
						</div>

						{/* Icon Buttons */}
						<div>
							<h3 className="mb-4 text-sm font-medium text-muted-foreground">Icon Buttons</h3>
							<div className="flex flex-wrap items-center gap-4">
								<Button size="icon-xs" variant="ghost">
									<Zap />
								</Button>
								<Button size="icon-sm" variant="outline">
									<Zap />
								</Button>
								<Button size="icon" variant="default">
									<Zap />
								</Button>
								<Button size="icon-lg" variant="default">
									<Zap />
								</Button>
							</div>
						</div>
					</div>
				</section>

				{/* Cards */}
				<section>
					<SectionHeader title="Cards" description="Card variants and composition" />
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Card variant="default">
							<CardHeader>
								<CardTitle>Default Card</CardTitle>
								<CardDescription>Standard card with border and subtle shadow</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">Card content goes here.</p>
							</CardContent>
						</Card>

						<Card variant="elevated">
							<CardHeader>
								<CardTitle>Elevated Card</CardTitle>
								<CardDescription>No border, larger shadow for depth</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">Card content goes here.</p>
							</CardContent>
						</Card>

						<Card variant="rx">
							<CardHeader>
								<RxLabel>Prescription</RxLabel>
								<CardTitle>RX Card</CardTitle>
								<CardDescription>Prescription-label style with accent bar</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">Card content goes here.</p>
							</CardContent>
						</Card>

						<Card variant="interactive">
							<CardHeader>
								<CardTitle>Interactive Card</CardTitle>
								<CardDescription>Hover effects for clickable cards</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">Try hovering over this card.</p>
							</CardContent>
						</Card>

						<Card variant="panel">
							<CardHeader>
								<CardTitle>Panel Card</CardTitle>
								<CardDescription>Clean hardware panel with double border</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">Card content goes here.</p>
							</CardContent>
						</Card>

						<Card variant="ghost">
							<CardHeader>
								<CardTitle>Ghost Card</CardTitle>
								<CardDescription>Minimal styling, transparent background</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">Card content goes here.</p>
							</CardContent>
						</Card>
					</div>
				</section>

				{/* RX Components */}
				<section>
					<SectionHeader title="RX Components" description="Prescription-style typography" />
					<Card variant="rx">
						<CardHeader className="border-b border-border">
							<RxLabel>Track Analysis</RxLabel>
							<CardTitle>Midnight City</CardTitle>
							<CardDescription>M83 • Hurry Up, We're Dreaming</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="grid grid-cols-3 gap-4 text-center">
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
						</CardContent>
					</Card>
				</section>

				{/* Badges */}
				<section>
					<SectionHeader title="Badges" description="Status indicators and labels" />
					<div className="space-y-8">
						{/* Standard Variants */}
						<div>
							<h3 className="mb-4 text-sm font-medium text-muted-foreground">Standard Variants</h3>
							<div className="flex flex-wrap gap-3">
								<Badge variant="default">Default</Badge>
								<Badge variant="secondary">Secondary</Badge>
								<Badge variant="outline">Outline</Badge>
								<Badge variant="ghost">Ghost</Badge>
								<Badge variant="destructive">Destructive</Badge>
							</div>
						</div>

						{/* Brand Variants */}
						<div>
							<h3 className="mb-4 text-sm font-medium text-muted-foreground">Brand Variants</h3>
							<div className="flex flex-wrap gap-3">
								<Badge variant="vibe">Vibe</Badge>
								<Badge variant="purple">Purple</Badge>
								<Badge variant="cyan">Cyan</Badge>
								<Badge variant="pink">Pink</Badge>
								<Badge variant="lime">Lime</Badge>
							</div>
						</div>

						{/* Energy Variants */}
						<div>
							<h3 className="mb-4 text-sm font-medium text-muted-foreground">Energy Levels</h3>
							<div className="flex flex-wrap gap-3">
								<Badge variant="energy-low">Low Energy</Badge>
								<Badge variant="energy-medium">Medium Energy</Badge>
								<Badge variant="energy-high">High Energy</Badge>
							</div>
						</div>

						{/* Key Compatibility */}
						<div>
							<h3 className="mb-4 text-sm font-medium text-muted-foreground">Key Compatibility</h3>
							<div className="flex flex-wrap gap-3">
								<Badge variant="key-compatible">
									<Zap className="size-3" />
									Harmonic Match
								</Badge>
								<Badge variant="key-neutral">Neutral</Badge>
								<Badge variant="key-clash">Key Clash</Badge>
							</div>
						</div>

						{/* Specialized Badges */}
						<div>
							<h3 className="mb-4 text-sm font-medium text-muted-foreground">Specialized Badges</h3>
							<div className="flex flex-wrap gap-3">
								<BpmBadge bpm={128} />
								<EnergyBadge energy={0.3} />
								<EnergyBadge energy={0.55} />
								<EnergyBadge energy={0.85} />
								<KeyBadge musicalKey={7} mode={1} />
								<KeyBadge musicalKey={0} mode={0} />
							</div>
						</div>

						{/* Sizes */}
						<div>
							<h3 className="mb-4 text-sm font-medium text-muted-foreground">Sizes</h3>
							<div className="flex flex-wrap items-center gap-3">
								<Badge size="sm">Small</Badge>
								<Badge size="default">Default</Badge>
								<Badge size="lg">Large</Badge>
							</div>
						</div>
					</div>
				</section>

				{/* Progress Bars */}
				<section>
					<SectionHeader title="Progress & Meters" description="Dosage-bar style indicators" />
					<div className="grid gap-8 md:grid-cols-2">
						{/* Standard Progress */}
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Progress Variants</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<span className="text-xs text-muted-foreground">Default</span>
									<Progress value={60} />
								</div>
								<div className="space-y-2">
									<span className="text-xs text-muted-foreground">Primary</span>
									<Progress value={75} variant="primary" />
								</div>
								<div className="space-y-2">
									<span className="text-xs text-muted-foreground">Cyan</span>
									<Progress value={45} variant="cyan" />
								</div>
								<div className="space-y-2">
									<span className="text-xs text-muted-foreground">Pink</span>
									<Progress value={85} variant="pink" />
								</div>
								<div className="space-y-2">
									<span className="text-xs text-muted-foreground">Lime</span>
									<Progress value={55} variant="lime" />
								</div>
							</CardContent>
						</Card>

						{/* Energy Levels */}
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Energy Variant (Auto-color)</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<span className="text-xs text-muted-foreground">Low (0-39%)</span>
									<Progress value={25} variant="energy" />
								</div>
								<div className="space-y-2">
									<span className="text-xs text-muted-foreground">Medium (40-69%)</span>
									<Progress value={55} variant="energy" />
								</div>
								<div className="space-y-2">
									<span className="text-xs text-muted-foreground">High (70-100%)</span>
									<Progress value={85} variant="energy" />
								</div>
							</CardContent>
						</Card>

						{/* DosageBar */}
						<Card>
							<CardHeader>
								<CardTitle className="text-base">DosageBar Components</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<DosageBar label="Energy" value={78} variant="energy" />
								<DosageBar label="Danceability" value={65} variant="cyan" />
								<DosageBar label="Valence" value={42} variant="pink" />
								<DosageBar label="Acousticness" value={12} variant="lime" />
							</CardContent>
						</Card>

						{/* Specialized Meters */}
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Specialized Meters</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<EnergyMeter energy={0.72} />
								<BpmMeter bpm={128} />
								<BpmMeter bpm={95} min={60} max={180} />
							</CardContent>
						</Card>
					</div>
				</section>

				{/* Sizes */}
				<section>
					<SectionHeader title="Progress Sizes" description="Different thickness options" />
					<Card>
						<CardContent className="space-y-4 pt-6">
							<div className="space-y-2">
								<span className="text-xs text-muted-foreground">Small (1px)</span>
								<Progress value={65} variant="primary" size="sm" />
							</div>
							<div className="space-y-2">
								<span className="text-xs text-muted-foreground">Default (2px)</span>
								<Progress value={65} variant="primary" size="default" />
							</div>
							<div className="space-y-2">
								<span className="text-xs text-muted-foreground">Large (3px)</span>
								<Progress value={65} variant="primary" size="lg" />
							</div>
						</CardContent>
					</Card>
				</section>

				{/* Transitions */}
				<section>
					<SectionHeader title="Transitions" description="Functional transition effects" />
					<div className="flex flex-wrap gap-6">
						<Button variant="default">Hover Me</Button>
						<Button variant="outline">Hover Me</Button>
						<Card variant="interactive" className="w-48 p-4 text-center text-sm">
							Interactive Card
						</Card>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="border-t border-border py-8">
				<div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
					<p>VibeRX Design System • Development Mode Only</p>
				</div>
			</footer>
		</div>
	);
}

function SectionHeader({ title, description }: { title: string; description: string }) {
	return (
		<div className="mb-8">
			<h2 className="text-2xl font-bold tracking-tight">{title}</h2>
			<p className="text-muted-foreground">{description}</p>
		</div>
	);
}

function ColorSwatch({
	name,
	variable,
	hex,
	className,
	copied,
	onCopy,
}: {
	name: string;
	variable: string;
	hex: string;
	className: string;
	copied: boolean;
	onCopy: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onCopy}
			title={variable}
			className="group flex flex-col overflow-hidden rounded-sm border border-border bg-card text-left transition-colors hover:border-primary/50"
		>
			<div className={`h-16 w-full ${className}`} />
			<div className="flex flex-1 items-center justify-between p-3">
				<div>
					<p className="font-medium text-sm">{name}</p>
					<p className="font-mono text-xs text-muted-foreground">{hex}</p>
				</div>
				<div className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
					{copied ? <Check className="size-4 text-key-compatible" /> : <Copy className="size-4" />}
				</div>
			</div>
		</button>
	);
}
