<script lang="ts" context="module">
	export const tabContent =
		"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
</script>

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

<TabPanel class={cn(tabContent, className)}>
	<slot />
</TabPanel>
