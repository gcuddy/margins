<script lang="ts" context="module">
	export const tabList =
		"inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground";
</script>

<script lang="ts">
	import { TabList } from "@rgossiaux/svelte-headlessui";

	import { cn } from "$lib/utils/tailwind";
	import { cva } from "class-variance-authority";
	let className = "";
	export { className as class };
</script>

<TabList class={cn(tabList, className)}>
	<slot />
</TabList>
