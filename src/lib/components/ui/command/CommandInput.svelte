<script lang="ts">
	import CommandInput from "$lib/components/ui/cmdk/Command.Input.svelte";
	import { cn } from "$lib/utils/tailwind";
	import { Search } from "lucide-svelte";
	import type {
		HTMLBaseAttributes,
		HTMLInputAttributes,
	} from "svelte/elements";
	import type { ComponentProps } from "svelte";

	let className = "";
	export { className as class };
	export let value = "";
	interface $$Props extends HTMLInputAttributes, ComponentProps<CommandInput> {
		class?: string;
		value?: string;
	}
</script>

<div
	class="flex items-center border-b border-b-gray-100 px-4 dark:border-b-gray-700"
	data-cmdk-input-wrapper=""
>
	<Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
	<CommandInput
		bind:value
		class={cn(
			"flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-50",
			className
		)}
		{...$$restProps}
	/>
</div>
