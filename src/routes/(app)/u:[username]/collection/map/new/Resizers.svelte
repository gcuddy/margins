<script lang="ts">
	import { drag } from "$lib/stores/drag";

	export let height: number;
	export let width: number;
	export let x: number;
	export let y: number;
	let resizing = false;
	// function mouseMove(e: MouseEvent) {
	// 	if (!resizing) return;
	// 	console.log({ e });
	// }

	let direction: string | null = null;
</script>

<g
	pointer-events="all"
	use:drag={{
		cb: (event) => {
			if (!direction) return;
			// const posChange = (width - event.clientX) * -1;
			let delta = 0;
			console.log({ direction });
			console.log({ event });
			if (direction.match("east")) {
				const startingX = Math.round(width + x);

				delta = event.layerX - startingX;
				width = Math.max(0, width + delta);
				// const newWidth = width + delta;
			}

			if (direction.match("west")) {
				delta = x - event.layerX;
				width = Math.max(0, width + delta);
			}

			if (direction.match("north")) {
				delta = y - event.layerY;
				height = Math.max(0, height + delta);
			}

			if (direction.match("south")) {
				const startingY = Math.round(height + y);
				delta = event.layerY - startingY;
				height = Math.max(0, height + delta);
				console.log({ delta });
			}
			console.log({ delta });
			// const el = event.target;
			// console.log({ el });
			// console.log({ event, x });
			// const deltaX = event.offsetX - x;
			// const deltaY = event.pageY - x;
			// const newWidth = width + deltaX;
			// const newHeight = height + deltaY;
			// console.log({ deltaX, deltaY, newWidth, newHeight });
		},
		click: (e) => {
			console.log("click", e);
			//@ts-ignore
			direction = e.target?.dataset?.direction;
			console.log({ direction });
		},
	}}
	on:mouseup={() => (resizing = false)}
	on:mousedown|preventDefault|stopPropagation={(e) => (resizing = true)}
>
	<rect
		data-direction="west"
		class="cursor-w-resize fill-transparent stroke-transparent"
		height={height + 4}
		width={6}
		y={0}
		x={-3}
	/>
	<rect
		data-direction="north"
		class="cursor-n-resize fill-transparent stroke-transparent"
		height={6}
		width={width + 6}
		y={-3}
		x={0}
	/>
	<rect
		data-direction="south"
		class="cursor-s-resize fill-transparent stroke-transparent"
		height={6}
		width={width + 4}
		y={height + 4}
		x={-3}
	/>
	<rect
		data-direction="east"
		class="cursor-e-resize fill-transparent stroke-transparent"
		height={height + 4}
		width={6}
		y={0}
		x={width}
	/>
	<circle data-direction="northwest" class="cursor-nw-resize stroke-sky-500 stroke-2" cx={-2} cy={-2} r={3} />
	<circle
		data-direction="southwest"
		class="cursor-sw-resize stroke-sky-500 stroke-2"
		cx={-2}
		cy={height + 6}
		r={3}
	/>
	<circle
		data-direction="northeast"
		class="cursor-ne-resize stroke-sky-500 stroke-2"
		cx={width + 4}
		cy={-2}
		r={3}
	/>
	<circle
		data-direction="southeast"
		class="cursor-se-resize stroke-sky-500 stroke-2"
		cx={width + 4}
		cy={height + 6}
		r={3}
	/>
</g>
