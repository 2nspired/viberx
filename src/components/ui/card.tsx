import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * VibeRX Card Component
 *
 * Variants:
 * - default: Standard card with border
 * - elevated: Subtle shadow, no border
 * - rx: Prescription label style with top accent bar
 * - interactive: Hover effects for clickable cards
 * - ghost: Minimal styling
 */
const cardVariants = cva("flex flex-col rounded-sm text-card-foreground", {
	variants: {
		variant: {
			default: "bg-card border shadow-sm",
			elevated: "bg-card shadow-lg shadow-black/5 dark:shadow-black/20",
			rx: "bg-card border-2 relative before:absolute before:inset-x-0 before:top-0 before:h-1 before:rounded-t-sm before:bg-primary",
			interactive:
				"bg-card border cursor-pointer transition-colors duration-200 hover:border-primary/50",
			ghost: "bg-transparent",
			panel: "bg-card border-2 border-border",
		},
		padding: {
			default: "gap-6 py-6",
			compact: "gap-4 py-4",
			none: "",
		},
	},
	defaultVariants: {
		variant: "default",
		padding: "default",
	},
});

function Card({
	className,
	variant,
	padding,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
	return (
		<div
			data-slot="card"
			data-variant={variant}
			className={cn(cardVariants({ variant, padding, className }))}
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
				className
			)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn("leading-none font-semibold tracking-tight", className)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-action"
			className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
			{...props}
		/>
	);
}

/**
 * RxLabel - Prescription-style label text
 * Used for small descriptive labels in cards
 */
function RxLabel({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="rx-label"
			className={cn("font-mono text-xs uppercase tracking-wider text-muted-foreground", className)}
			{...props}
		/>
	);
}

/**
 * RxValue - Prescription-style value text
 * Used for displaying metrics like BPM, energy, etc.
 */
function RxValue({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="rx-value"
			className={cn("font-sans text-lg font-semibold tabular-nums", className)}
			{...props}
		/>
	);
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
	RxLabel,
	RxValue,
	cardVariants,
};
