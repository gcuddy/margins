<script lang="ts">
	import { TabPanel } from "@rgossiaux/svelte-headlessui";

	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	let className: string | null = "";
	export { className as class };

	interface $$Props extends HTMLBaseAttributes {
		class?: string | null;
	}
</script>

<TabPanel
	class={cn(
		"mt-2 rounded-md border border-gray-200 p-6 dark:border-gray-700",
		className
	)}
>
	<slot />
</TabPanel>
