<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import { ListboxOption } from "@rgossiaux/svelte-headlessui";
	import type { ComponentProps } from "svelte";
	let className = "";
	export { className as class };

	type T = $$Generic<string | number | string[] | null | undefined>;

	type ListboxProps = ComponentProps<ListboxOption<"div">>;

	interface $$Props extends ListboxProps {
		class?: string;
		value: T;
	}
	export let value: T;
</script>

<ListboxOption
	class={cn(
		"flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{value}
	{...$$restProps}
>
	<slot />
</ListboxOption>
