<script lang="ts" context="module">
	export const tabTrigger = cva(
		"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
		{
			variants: {
				selected: {
					true: "bg-background text-foreground shadow-sm",
				},
			},
		}
	);
</script>

<script lang="ts">
	import { Tab } from "@rgossiaux/svelte-headlessui";
	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	import type { ComponentProps } from "svelte";
	import { VariantProps, cva } from "class-variance-authority";
	// let className: string | undefined | null = "";
	// export { className as class };
	interface $$Props extends ComponentProps<Tab<"div" | "a">> {
		// class?: string | null;
	}
</script>

<Tab
	draggable="false"
	class={({ selected }) => cn(tabTrigger({ selected }), $$props.class)}
	{...$$restProps}
>
	<slot />
</Tab>
