<script lang="ts">
	import { TabList } from "@rgossiaux/svelte-headlessui";

	import { cn } from "$lib/utils/tailwind";
	let className = "";
	export { className as class };
</script>

<TabList
	class={cn(
		"inline-flex items-center justify-center rounded-md bg-gray-100 p-1 dark:bg-gray-800",
		className
	)}
>
	<slot />
</TabList>
