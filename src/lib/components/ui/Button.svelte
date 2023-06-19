<script lang="ts" context="module">
	export const buttonVariants = cva(
		"inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background [&>svg]:text-muted-foreground",
		{
			variants: {
				variant: {
					default: "bg-primary text-primary-foreground hover:bg-primary/90 [&>svg]:text-inherit",
					destructive:
						"bg-destructive text-destructive-foreground hover:bg-destructive/90",
					outline:
						"border border-input hover:bg-accent hover:text-accent-foreground",
					// dashed: 'border border-input hover:bg-accent hover:text-accent-foreground border-dashed',
					secondary:
						"bg-secondary text-secondary-foreground hover:bg-secondary/80",
					ghost: "hover:bg-accent hover:text-accent-foreground",
					link: "underline-offset-4 hover:underline text-primary",
				},
				size: {
					default: "h-10 py-2 px-4",
					sm: "h-9 px-2 rounded-md",
					lg: "h-11 px-8 rounded-md",
					xs: 'h-8 px-1.5 text-xs'
				},
			},
			defaultVariants: {
				variant: "default",
				size: "default",
			},
		}
	);
	// export const buttonVariants = cva(
	// 	"active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:hover:bg-gray-800 dark:hover:text-gray-100 disabled:opacity-50 dark:focus:ring-gray-400 disabled:pointer-events-none dark:focus:ring-offset-gray-900 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-800 ",
	// 	{
	// 		variants: {
	// 			variant: {
	// 				default:
	// 					"bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900",
	// 				destructive:
	// 					"bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600",
	// 				outline:
	// 					"bg-transparent border border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-100",
	// 				subtle:
	// 					"bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100",
	// 				ghost:
	// 					"bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100 dark:hover:text-gray-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent",
	// 				link: "bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-gray-900 dark:text-gray-100 hover:bg-transparent dark:hover:bg-transparent",
	// 				texture:
	// 					"border border-gray-300 bg-elevation/90 text-gray-600 hover:border-gray-300  hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:text-gray-300  dark:hover:text-gray-200",
	// 			},
	// 			size: {
	// 				default: "h-10 py-2 px-4",
	// 				xs: "h-8 px-2 text-xs rounded-lg",
	// 				sm: "h-9 px-2 rounded-md",
	// 				lg: "h-11 px-8 rounded-md",
	// 			},
	// 		},
	// 	}
	// );
</script>

<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import { cva, type VariantProps } from "class-variance-authority";
	import type { HTMLButtonAttributes } from "svelte/elements";

	// Allow for some anchor attributes to be passed to the button
	interface Attributes extends HTMLButtonAttributes {
		href?: string | undefined | null;
	}

	interface $$Props extends Attributes, VariantProps<typeof buttonVariants> {
		class?: string;
		as?: string;
		ref?: HTMLElement;
		text?: string;
		onClick?: $$Props["on:click"]
	}

	export let as = "button";
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let ref: $$Props["ref"] = undefined;
	export let text: $$Props["text"] = undefined;
	export let onClick: $$Props["on:click"] = undefined;
	let c = "";
	export { c as class };
</script>

<svelte:element
	this={as}
	bind:this={ref}
	{...$$restProps}
	on:click={onClick}
	on:click
	on:pointerdown
	class={cn(buttonVariants({ variant, size, class: c }))}
>
	<slot>
		{#if text}
			{text}
		{/if}
	</slot>
</svelte:element>
