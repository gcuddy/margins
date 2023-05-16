<script lang="ts">
	import { cn } from "$lib/utils/tailwind";
	import {
		Listbox,
		ListboxButton,
		ListboxOptions,
		ListboxOption,
	} from "@rgossiaux/svelte-headlessui";
	import { ChevronDownIcon } from "lucide-svelte";
	import { getSelectContext } from "./Select.svelte";
	let className = "";
	export { className as class };

	const { popperRef } = getSelectContext();
</script>

<ListboxButton
	use={[popperRef]}
	class={cn(
		"flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
>
	<slot />
	<ChevronDownIcon class="h-4 w-4 opacity-50" aria-hidden />
</ListboxButton>
