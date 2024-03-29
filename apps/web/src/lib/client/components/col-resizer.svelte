<script lang="ts">
	/**
	 * Clamp `num` to the range `[min, max]`
	 * @param {number} num
	 * @param {number} min
	 * @param {number} max
	 */
	export function clamp(num: number, min: number, max: number) {
		return num < min ? min : num > max ? max : num;
	}

	let className = '';
	export { className as class };
	export let width: number;
	export let max = 400;
	export let min = 200;

	export let direction: 'n' | 'e' | 's' | 'w' = 'e';

	export let disabled = false;

	let container: HTMLElement;

	let dragging = false;
	// let pos: number;
	// $: pos = clamp(pos, min, max);

	function setPos(event: MouseEvent) {
		if (disabled) return;

		const { left, top } = container.getBoundingClientRect();

		switch (direction) {
			case 'w': {
				const pos_change = left - event.clientX;
				width = clamp(width + pos_change, min, max);
				break;
			}
			case 'e': {
				const pos_change = event.clientX - left;
				width = clamp(width + pos_change, min, max);
				break;
			}
			case 'n': {
				const pos_change = top - event.clientY;
				width = clamp(width + pos_change, min, max);
				break;
			}
			case 's': {
				const pos_change = event.clientY - top;
				width = clamp(width + pos_change, min, max);
				break;
			}
		}
		return;
	}

	function drag(node: HTMLElement, callback: (event: MouseEvent) => void) {
		const mousedown = (event: MouseEvent) => {
			if (event.which !== 1) return;

			event.preventDefault();

			dragging = true;

			const onmouseup = () => {
				dragging = false;

				window.removeEventListener('mousemove', callback, false);
				window.removeEventListener('mouseup', onmouseup, false);
			};

			window.addEventListener('mousemove', callback, false);
			window.addEventListener('mouseup', onmouseup, false);
		};

		node.addEventListener('mousedown', mousedown, false);

		return {
			destroy() {
				node.removeEventListener('mousedown', mousedown, false);
			},
		};
	}
</script>

<div
	data-isdragging={dragging}
	bind:this={container}
	class={className}
	role="separator"
	use:drag={setPos}
/>
