<script lang="ts" context="module">
	export interface Shape {
		// parentId?: string;
		// props: {};
		// type: string;
		id: string;
		y: number;
		x: number;
		height: number;
		width: number;
		selected: boolean;
		dragging: boolean;
		editing: boolean;
	}
</script>

<script lang="ts">
	import { clickOutside } from "$lib/actions/clickOutside";
	import resize from "$lib/actions/resize";
	import { draggable } from "@neodrag/svelte";
	import { createEventDispatcher, onMount, tick } from "svelte";
	import Text from "./Text.svelte";

	type Type = "text" | "entry" | "annotation" | "shape";

	// export let as: string;

	export let id: string;
	export let y = 0;
	export let x = 0;
	export let height = 0;
	export let width = 0;
	export let selected = false;
	export let dragging = false;
	export let editing = false;

	interface $$Props extends Shape {}

	const dispatch = createEventDispatcher<{
		select: {
			x: number;
			y: number;
			width: number;
			height: number;
		};
	}>();

	function handleClick(e: PointerEvent) {
		selected = true;
		// dispatch("select", {
		// 	x,
		// 	y,
		// 	width,
		// 	height,
		// });
	}

	$: console.log({ x, y });

	// see how tldraw does this with idb - pretty intuitive
	let wrapper: HTMLElement;
	onMount(() => {
		const rect = wrapper?.getBoundingClientRect();
		height = rect.height;
		width = rect.width;
	});
</script>

<!-- container -->
<div
	style:height="{height}px"
	style:width="{width}px"
	use:draggable={{
		position: {
			x,
			y,
		},
		onDragStart: () => {
			dragging = true;
		},
		onDragEnd: ({ offsetX, offsetY }) => {
			dragging = false;
			x = offsetX;
			y = offsetY;
		},
	}}
	on:pointerdown={handleClick}
	use:clickOutside={async () => {
		// await tick();
		selected = false;
	}}
>
	<!-- html container -->
	<div class="absolute inset-0" {id}>
		<!-- shape wrapper -->
		<div
			style:width="max-content"
			bind:this={wrapper}
			use:resize={(e) => {
				height = e.borderBoxSize[0].blockSize;
				width = e.borderBoxSize[0].inlineSize;
				console.log({ e, height, width });
			}}
		>
			<!-- object itself -->
			<!-- <div>Test</div> -->
			<Text {height} bind:editing value="Test" />
		</div>
	</div>
	<!-- todo -->
</div>
<!-- <svelte:element this={as} use:draggable><slot /></svelte:element> -->
