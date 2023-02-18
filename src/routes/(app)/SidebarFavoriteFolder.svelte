<script lang="ts">
	import Icon from "$lib/components/helpers/Icon.svelte";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { tick } from "svelte";
	import { dndzone, SHADOW_PLACEHOLDER_ITEM_ID } from "svelte-dnd-action";
	import { slide } from "svelte/transition";
	import SidebarFavorite from "./SidebarFavorite.svelte";
	import SidebarItem from "./SidebarItem.svelte";

	export let favorite: RouterOutputs["favorites"]["list"][number];

	// read-only
	export let expanding = false;

	export let expanded = false;
</script>

<!-- REVIEW: taken from sidebarItem - should componentize better -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
	class="group flex h-7 cursor-default items-center rounded-lg px-2 font-medium text-gray-700 ring-inset  transition-transform duration-200 hover:bg-gray-200 focus-visible:ring dark:text-gray-300 dark:hover:bg-gray-600/50
"
	on:click={() => (expanded = !expanded)}
>
	<span class="flex items-center gap-2 truncate">
		<Icon
			className="w-4 h-4 stroke-2 stroke-gray-500 group-hover:stroke-gray-800 fill-primary-50 dark:fill-transparent dark:group-hover:fill-transparent group-hover:fill-primary-100 dark:group-hover:stroke-primary-100 relative"
			name={expanded ? "folderOpen" : "folder"}
		/>
		<span class="truncate">{favorite.folderName}</span>
		<Icon
			name="chevronUpSolid"
			direction={expanded ? "s" : "e"}
			className="h-4 w-4 fill-gray-500 opacity-0 group-hover:opacity-100 transition"
		/>
	</span>
</button>
{#if expanded}
	<div
		use:dndzone={{
			items: favorite.children,
			type: "favorite",
		}}
		on:consider={(e) => {
			favorite.children = e.detail.items;
		}}
		transition:slide
		on:introstart={() => (expanding = true)}
		on:introend={() => (expanding = false)}
		on:outrostart={() => (expanding = true)}
		on:outroend={() => tick().then(() => (expanding = false))}
		class="ml-4 space-y-0.5 border-l border-gray-500/25 pl-1.5"
	>
		{#if favorite.children.length}
			{#each favorite.children.filter((item) => item.id !== SHADOW_PLACEHOLDER_ITEM_ID) as child}
				<!-- sidebar favorite -->
				<SidebarFavorite favorite={child} />
			{/each}
		{:else}
			<div class="p-4">No items</div>
		{/if}
	</div>
{/if}
<!-- {#if $items?.length && !_collapsed}
	<div class="ml-4 space-y-0.5 border-l border-gray-500/25 pl-1.5">
		{#each $items.map((i) => ({ ...i, id: useId() })) as item (item.id)}
			<div animate:flip>
				<svelte:self {...item} indent={indent + 1} />
			</div>
		{/each}
	</div>
{/if} -->
