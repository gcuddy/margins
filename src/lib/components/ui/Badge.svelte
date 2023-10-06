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
                    ghost: "hocus:bg-accent hocus:text-accent-foreground border-transparent hocus:border"
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
	import type { HTMLAnchorAttributes, HTMLBaseAttributes } from "svelte/elements";

    type Variants = VariantProps<typeof badgeVariants>;

    type As = {
        as?: string;
    }

    interface AnchorElement extends HTMLAnchorAttributes, Variants, As {
        href?: HTMLAnchorAttributes["href"];
    }

    interface BaseElement extends HTMLBaseAttributes, Variants, As {}

	type $$Props = AnchorElement | BaseElement;

	export let as = "div";
	export let variant: $$Props["variant"] = "default";
	let c: string | null | undefined = "";
	export { c as class };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
	this={as}
	{...$$restProps}
	on:click
	on:pointerdown
	class={cn(badgeVariants({ variant, class: c }))}
>
	<slot />
</svelte:element>
