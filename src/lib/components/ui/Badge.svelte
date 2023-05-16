<script lang="ts" context="module">
	export const badgeVariants = cva(
		"inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
		{
			variants: {
				variant: {
					default:
						"bg-primary hover:bg-primary/80 border-transparent text-primary-foreground",
					secondary:
						"bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground",
					destructive:
						"bg-destructive hover:bg-secondary/80 border-transparent text-destructive-foreground",
					outline: "text-foreground",
				},
			},
			defaultVariants: {
				variant: "default",
			},
		}
	);
</script>

<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import { cva, type VariantProps } from "class-variance-authority";
	import type { HTMLBaseAttributes } from "svelte/elements";

	// Allow for some anchor attributes to be passed to the button
	interface Attributes extends HTMLBaseAttributes {
		href?: string | undefined | null;
	}

	interface $$Props extends Attributes, VariantProps<typeof badgeVariants> {
		class?: string;
		as?: string;
	}

	export let as = "div";
	export let variant: $$Props["variant"] = "default";
	let c = "";
	export { c as class };
</script>

<svelte:element
	this={as}
	{...$$restProps}
	on:click
	on:pointerdown
	class={cn(badgeVariants({ variant, class: c }))}
>
	<slot />
</svelte:element>
