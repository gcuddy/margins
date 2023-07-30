<script lang="ts" context="module">
	export const tabList =
		"inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground";
</script>

<script lang="ts">
	import { TabList } from "@rgossiaux/svelte-headlessui";

	import { cn } from "$lib/utils/tailwind";
	import { cva } from "class-variance-authority";
	import type { Maybe } from "$lib/utils/type-utils";
	import type { HTMLAttributes, HTMLBaseAttributes } from "svelte/elements";
	import { getTabsContext, type Tabs } from "./utils";
	let className: Maybe<string> = "";
	export { className as class };

    type $$Props = HTMLAttributes<HTMLDivElement> & {
        list?: Tabs["list"];
    };

    export let list: Tabs["list"] = getTabsContext().list;
</script>

<div melt={$list} class={cn(tabList, className)}>
	<slot />
</div>
