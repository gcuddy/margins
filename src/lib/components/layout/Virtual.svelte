<script lang="ts">
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import { onMount } from 'svelte';
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME, setDebugMode } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import type { number, string } from 'zod';

	// setDebugMode(true);

	// TODO: initialRect works for ssr

	let virtualizer: ReturnType<typeof createVirtualizer>;
	type WithId = { id: number; [key: string]: any };
	type T = $$Generic<WithId>;
	export let items: (T | WithId)[] = [
		{ id: 11, name: 'item11' },
		{ id: 12, name: 'item12' },
		{ id: 13, name: 'item13' },
		{ id: 14, name: 'item14' },
		{ id: 15, name: 'item15' },
		{ id: 16, name: 'item16' },
		{ id: 17, name: 'item17' },
	];
	export let getItemKey = (index: number): number | string => items[index].id;
	onMount(() => {
		if (el) {
			virtualizer = createVirtualizer({
				count: items.length,
				overscan: 5,
				getScrollElement: () => el,
				estimateSize: () => 40,
				getItemKey,
			});
		}
	});
	const flipDurationMs = 300;
	// $: items,
	// 	$virtualizer?.setOptions({
	// 		...$virtualizer.options,
	// 		count: items.length,
	// 	});
	let el: Element;
	// $virtualizer.setOptions()

	function handleDndConsider(e) {
		// $virtualizer.setOptions({
		// 	...$virtualizer.options,
		// 	count: items.length - 1,
		// });
		items = e.detail.items;
		console.log({ items });
	}
	function handleDndFinalize(e) {
		items = e.detail.items;
		console.log({ items });
	}
	$: console.log($virtualizer?.measurementsCache);
</script>

<button> add 10 items </button>
{JSON.stringify(items, null, 2)}
<div bind:this={el} class=" h-[300px] w-[400px] overflow-auto border border-red-500">
	{#if virtualizer}
		<div
			class="relative w-full"
			style:height="{$virtualizer?.getTotalSize()}px"
			use:dndzone={{ items, dropTargetStyle: {}, morphDisabled: true }}
			on:consider={handleDndConsider}
			on:finalize={handleDndFinalize}
		>
			<!-- todo -->
			{#each $virtualizer.getVirtualItems() as row (row.key)}
				{@const item = items[row.index]}
				<!-- <div class="mt-2 h-5 border border-blue-400">{item.index}</div> -->
				<div class="row" class:odd={row.index % 2} data-index={row.index}>
					<slot>
						{JSON.stringify(row, null, 2)}
						Row {items[row.index].name}</slot
					>
					<!-- {#if items[row.index][SHADOW_ITEM_MARKER_PROPERTY_NAME]}
						<div class="custom-shadow-item">
							{item.name}
						</div>
					{/if} -->
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	.row {
		position: relative;
	}
	.custom-shadow-item {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		visibility: visible;
		border: 1px dashed grey;
		background: lightblue;
		opacity: 0.5;
		margin: 0;
	}
</style>
