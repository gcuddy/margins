<script lang="ts">
	import resize from "$lib/actions/resize";
	import { draggable } from "@neodrag/svelte";
	import Item, { Shape } from "./Item.svelte";
	import { nanoid } from "nanoid";
	import Resizers from "./Resizers.svelte";
	let items: Shape[] = [
		{
			id: nanoid(),
			x: 0,
			y: 0,
			height: 50,
			width: 100,
			selected: false,
			dragging: false,
			editing: false,
		},
	];

	$: selected = items.filter((i) => i.selected && !i.dragging);

	// let selected: Array<{
	// 	x: number;
	// 	y: number;
	// 	height: number;
	// 	width: number;
	// 	id: string;
	// }> = [];
</script>

<!-- TODO: title placement -->

<div class="absolute inset-0">
	<!-- TODO: scaling/panning -->
	<div class="html-layer absolute top-0 left-0 z-[3] h-[1px] w-[1px] transform-gpu select-none outline-none">
		{#each items as { x, y, dragging, editing, height, width, selected, id } (id)}
			{#if selected}
				<!-- <div
					on:mousedown={(e) => console.log(e)}
					class="opacity-1 absolute top-0 left-0 origin-top-left bg-transparent"
					style="pointer-events:all; width:{width + 2}px; height: {height +
						4}px; transform:translate({x}px, {y}px);"
				/> -->
			{/if}
			<!-- TODO: make item take in ONE item object to avoid this -->
			<Item bind:editing bind:dragging bind:x bind:y bind:height bind:width bind:selected bind:id />
		{/each}
		<!-- <Item
			on:select={({ detail }) => {
				selected[0] = { ...detail, id: "test" };
			}}
			id="test"
		/> -->
		<!-- <h1 use:draggable>My Map</h1> -->
	</div>
	<svg class="svg-layer pointer-events-none absolute top-0 left-0 z-[4] h-full w-full overflow-visible">
		{#each selected as { height, editing, width, x, y, id } (id)}
			{@const idx = items.findIndex((i) => i.id === id)}
			<g
				fill="none"
				style:--x="{x - 1}px"
				style:--y="{y - 2}px"
				class="translate-x-[var(--x)] translate-y-[var(--y)]  "
			>
				{#if !editing}
					<!-- resizers -->
					<Resizers {x} {y} bind:height={items[idx].height} bind:width={items[idx].width} />
					<rect class="stroke-sky-500 stroke-2" height={height + 4} width={width + 2} stroke="1" />
				{/if}
			</g>
		{/each}
		<!-- TODO:  -->
	</svg>
</div>

<div class="palette top-o absolute right-0 flex h-44 w-20 flex-col rounded-lg bg-gray-500">
	<div>Size</div>
</div>

<style>
	.html-layer,
	.svg-layer {
		contain: layout style size;
	}

	/* rect,
	circle {
		stroke-width: 1.5px;
		stroke: blue;
	} */
</style>
