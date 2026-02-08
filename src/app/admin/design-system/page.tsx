/**
 * VibeRX Design System Admin Page
 *
 * Dev-only route for showcasing all design system components.
 * Protected by NODE_ENV check (development only).
 */

import { redirect } from "next/navigation";

import { DesignSystemShowcase } from "./design-system-showcase";

export default function DesignSystemPage() {
	// Dev mode only protection
	if (process.env.NODE_ENV !== "development") {
		redirect("/");
	}

	return <DesignSystemShowcase />;
}
