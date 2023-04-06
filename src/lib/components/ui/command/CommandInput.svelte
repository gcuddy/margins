<script lang="ts">
	import CommandInput from "$lib/components/ui/cmdk/Command.Input.svelte";
	import { cn } from "$lib/utils/tailwind";
	import { Search } from "lucide-svelte";
	import type { HTMLBaseAttributes } from "svelte/elements";

	let className = "";
	export { className as class };
	interface $$Props extends HTMLBaseAttributes {
		class?: string;
	}
</script>

<div
	class="flex items-center border-b border-b-slate-100 px-4 dark:border-b-slate-700"
	data-cmdk-input-wrapper=""
>
	<Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
	<CommandInput
		class={cn(
			"flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-50",
			className
		)}
		{...$$restProps}
	/>
</div>
