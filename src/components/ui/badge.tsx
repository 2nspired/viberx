import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * VibeRX Badge Component
 *
 * Variants:
 * - default: Primary purple
 * - secondary: Muted background
 * - outline: Border only
 * - destructive: Red/danger
 *
 * VibeRX-specific:
 * - energy-low: Cyan/blue for low energy
 * - energy-medium: Yellow/orange for medium energy
 * - energy-high: Red/pink for high energy
 * - key-compatible: Green for harmonic matches
 * - key-neutral: Yellow for neutral transitions
 * - key-clash: Red for key clashes
 * - bpm: Monospace for BPM display
 * - vibe: Gradient brand style
 */
const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-sm border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] overflow-hidden",
	{
		variants: {
			variant: {
				default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
				destructive:
					"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
				outline: "border-border text-foreground [a&]:hover:bg-accent",
				ghost: "border-transparent [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",

				// VibeRX Energy Levels
				"energy-low": "border-energy-low/30 bg-energy-low/15 text-energy-low dark:bg-energy-low/20",
				"energy-medium":
					"border-energy-medium/30 bg-energy-medium/15 text-energy-medium dark:bg-energy-medium/20",
				"energy-high":
					"border-energy-high/30 bg-energy-high/15 text-energy-high dark:bg-energy-high/20",

				// VibeRX Key Compatibility
				"key-compatible":
					"border-key-compatible/30 bg-key-compatible/15 text-key-compatible dark:bg-key-compatible/20",
				"key-neutral":
					"border-key-neutral/30 bg-key-neutral/15 text-key-neutral dark:bg-key-neutral/20",
				"key-clash": "border-key-clash/30 bg-key-clash/15 text-key-clash dark:bg-key-clash/20",

				// VibeRX Brand
				vibe: "border-transparent bg-primary text-primary-foreground",
				purple: "border-vibe-purple/30 bg-vibe-purple/15 text-vibe-purple dark:bg-vibe-purple/20",
				cyan: "border-vibe-cyan/30 bg-vibe-cyan/15 text-vibe-cyan dark:text-vibe-cyan",
				pink: "border-vibe-pink/30 bg-vibe-pink/15 text-vibe-pink dark:bg-vibe-pink/20",
				lime: "border-vibe-lime/30 bg-vibe-lime/15 text-vibe-lime dark:text-vibe-lime",
			},
			size: {
				default: "px-2.5 py-0.5 text-xs",
				sm: "px-2 py-0 text-[10px]",
				lg: "px-3 py-1 text-sm",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

function Badge({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : "span";

	return (
		<Comp
			data-slot="badge"
			data-variant={variant}
			className={cn(badgeVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

/**
 * BPM Badge - Displays BPM with monospace font
 */
function BpmBadge({
	bpm,
	className,
	...props
}: Omit<React.ComponentProps<typeof Badge>, "children"> & { bpm: number }) {
	return (
		<Badge variant="outline" className={cn("font-mono tabular-nums", className)} {...props}>
			{Math.round(bpm)} BPM
		</Badge>
	);
}

/**
 * Energy Badge - Auto-colors based on energy level (0-1)
 */
function EnergyBadge({
	energy,
	className,
	...props
}: Omit<React.ComponentProps<typeof Badge>, "children" | "variant"> & { energy: number }) {
	const variant = energy < 0.4 ? "energy-low" : energy < 0.7 ? "energy-medium" : "energy-high";
	const label = energy < 0.4 ? "Low" : energy < 0.7 ? "Medium" : "High";

	return (
		<Badge variant={variant} className={className} {...props}>
			{label}
		</Badge>
	);
}

/**
 * Key Badge - Displays musical key with Camelot notation
 */
function KeyBadge({
	musicalKey,
	mode,
	className,
	...props
}: Omit<React.ComponentProps<typeof Badge>, "children"> & {
	musicalKey: number; // 0-11
	mode: number; // 0 = minor, 1 = major
}) {
	const keyNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
	const keyName = keyNames[musicalKey] || "?";
	const modeName = mode === 1 ? "maj" : "min";

	return (
		<Badge variant="outline" className={cn("font-mono", className)} {...props}>
			{keyName} {modeName}
		</Badge>
	);
}

export { Badge, BpmBadge, EnergyBadge, KeyBadge, badgeVariants };
