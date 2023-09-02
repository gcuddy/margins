<script lang="ts">
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import { onMount } from 'svelte';
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import type { number, string } from 'zod';

	// TODO: initialRect works for ssr

	export let items: (T | WithId)[] = [
		{ id: 11, name: 'item11' },
		{ id: 12, name: 'item12' },
		{ id: 13, name: 'item13' },
		{ id: 14, name: 'item14' },
		{ id: 15, name: 'item15' },
		{ id: 16, name: 'item16' },
		{ id: 17, name: 'item17' },
	];
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
</script>

{JSON.stringify(items, null, 2)}
<div class=" h-[300px] w-[400px] overflow-auto border border-red-500">
	<div
		class="relative w-full"
		use:dndzone={{ items, dropTargetStyle: {}, morphDisabled: true }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		<!-- todo -->
		{#each items as item, index (item.id)}
			<!-- <div class="mt-2 h-5 border border-blue-400">{item.index}</div> -->
			<div>
				<slot>
					{JSON.stringify(item, null, 2)}
					Row {item.name}</slot
				>
				{#if item[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
					<div class="custom-shadow-item">
						{item.name}
					</div>
				{/if}
			</div>
		{/each}
	</div>
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
