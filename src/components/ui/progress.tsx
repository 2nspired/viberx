"use client";

import { Progress as ProgressPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * VibeRX Progress Component
 *
 * Dosage-bar style progress indicators for displaying
 * audio metrics like energy, valence, danceability, etc.
 */

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
	/** Color variant for the progress indicator */
	variant?: "default" | "energy" | "primary" | "cyan" | "pink" | "lime";
	/** Size variant */
	size?: "default" | "sm" | "lg";
	/** Show percentage label */
	showLabel?: boolean;
}

function Progress({
	className,
	value = 0,
	variant = "default",
	size = "default",
	showLabel = false,
	...props
}: ProgressProps) {
	const sizeClasses = {
		sm: "h-1",
		default: "h-2",
		lg: "h-3",
	};

	const indicatorClasses = {
		default: "bg-primary",
		energy: getEnergyColor(value ?? 0),
		primary: "bg-primary",
		cyan: "bg-vibe-cyan",
		pink: "bg-vibe-pink",
		lime: "bg-vibe-lime",
	};

	return (
		<div className="relative w-full">
			<ProgressPrimitive.Root
				data-slot="progress"
				className={cn(
					"bg-muted relative w-full overflow-hidden rounded-sm",
					sizeClasses[size],
					className
				)}
				{...props}
			>
				<ProgressPrimitive.Indicator
					data-slot="progress-indicator"
					className={cn(
						"h-full w-full flex-1 rounded-sm transition-all duration-500 ease-out",
						indicatorClasses[variant]
					)}
					style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
				/>
			</ProgressPrimitive.Root>
			{showLabel && (
				<span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground ml-2">
					{Math.round(value ?? 0)}%
				</span>
			)}
		</div>
	);
}

/**
 * Get color class based on energy level (0-100)
 */
function getEnergyColor(value: number): string {
	if (value < 40) return "bg-energy-low";
	if (value < 70) return "bg-energy-medium";
	return "bg-energy-high";
}

/**
 * DosageBar - Prescription-style labeled progress bar
 * Used for displaying audio metrics with labels
 */
function DosageBar({
	label,
	value,
	max = 100,
	variant = "default",
	className,
}: {
	label: string;
	value: number;
	max?: number;
	variant?: ProgressProps["variant"];
	className?: string;
}) {
	const percentage = (value / max) * 100;

	return (
		<div className={cn("space-y-1", className)}>
			<div className="flex items-center justify-between text-xs">
				<span className="font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
				<span className="font-mono tabular-nums text-foreground">
					{typeof value === "number" && value < 10 ? value.toFixed(2) : Math.round(value)}
					{max !== 100 && <span className="text-muted-foreground">/{max}</span>}
				</span>
			</div>
			<Progress value={percentage} variant={variant} size="sm" />
		</div>
	);
}

/**
 * EnergyMeter - Specialized progress bar for energy levels
 * Auto-colors based on the energy value
 */
function EnergyMeter({
	energy,
	className,
}: {
	energy: number; // 0-1 scale
	className?: string;
}) {
	return <DosageBar label="Energy" value={energy * 100} variant="energy" className={className} />;
}

/**
 * BpmMeter - Visual representation of BPM relative to range
 */
function BpmMeter({
	bpm,
	min = 60,
	max = 180,
	className,
}: {
	bpm: number;
	min?: number;
	max?: number;
	className?: string;
}) {
	const percentage = ((bpm - min) / (max - min)) * 100;
	const clampedPercentage = Math.max(0, Math.min(100, percentage));

	return (
		<div className={cn("space-y-1", className)}>
			<div className="flex items-center justify-between text-xs">
				<span className="font-mono uppercase tracking-wider text-muted-foreground">BPM</span>
				<span className="font-mono tabular-nums text-foreground text-sm font-semibold">
					{Math.round(bpm)}
				</span>
			</div>
			<Progress value={clampedPercentage} variant="primary" size="sm" />
			<div className="flex justify-between text-[10px] text-muted-foreground font-mono">
				<span>{min}</span>
				<span>{max}</span>
			</div>
		</div>
	);
}

export { Progress, DosageBar, EnergyMeter, BpmMeter };
