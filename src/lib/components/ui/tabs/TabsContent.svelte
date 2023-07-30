<script lang="ts" context="module">
	export const tabContent =
		"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
</script>

<script lang="ts">
	import { TabPanel } from "@rgossiaux/svelte-headlessui";

	import { cn } from "$lib/utils/tailwind";
	import type { HTMLBaseAttributes } from "svelte/elements";
	import { getTabsContext, type Tabs } from "./utils";
	import type { Maybe } from "$lib/utils/type-utils";
	let className: Maybe<string> = "";
	export { className as class };

	interface $$Props extends HTMLBaseAttributes {
        content?: Tabs["content"];
        value: string;
	}
    export let content: Tabs["content"] = getTabsContext().content;
    $: console.log({content})
    export let value: string;
</script>

<div melt={$content(value)} {...$$restProps} class={cn(tabContent, className)}>
	<slot />
</div>
