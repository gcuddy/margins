<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";

	import { cn } from "$lib/utils/tailwind";
	import { cva, VariantProps } from "class-variance-authority";

	const inputVariants = cva(
		"flex h-10 w-full rounded-md  bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-offset-2  focus:ring-gray-400  disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900",
		{
			variants: {
				variant: {
					naked: "bg-transparent border-none",
					default: "border border-gray-300  focus:ring-2",
				},
			},
		}
	);

	export let value: string | number | undefined = undefined;
	export let ref: HTMLInputElement | undefined = undefined;
	let className = "";
	export { className as class };
	export let variant: $$Props["variant"] = "default";
	interface $$Props
		extends HTMLInputAttributes,
			VariantProps<typeof inputVariants> {
		ref?: HTMLInputElement;
		value?: string | number | undefined;
		class?: string;
	}
</script>

<input
	bind:value
	class={cn(
		inputVariants({
			variant,
			class: className,
		})
	)}
	on:focus
	on:blur
	on:change
	on:keydown
	on:input
	bind:this={ref}
	{...$$restProps}
/>
