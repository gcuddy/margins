<script lang="ts">
	import { createEventDispatcher } from 'svelte';
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

	export let direction: 'n' | 'e' | 's' | 'w' = 'e'

	export let disabled = false;

	let container: HTMLElement;

	const dispatch = createEventDispatcher();

	let dragging = false;
	// let pos: number;
	// $: pos = clamp(pos, min, max);

	function setPos(event: MouseEvent) {
		console.log({event})

		if (disabled) return;

		const { top, left } = container.getBoundingClientRect();

		console.log({ top, left });

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
		const posChange = (width - event.clientX) * -1;
		const pos = clamp(width + posChange, min, max);
		if (posChange / width < -0.8) {
			dispatch('collapse');
		}
		width = pos;
	}

	function setTouchPos(event) {
		console.log({ event });
	}

	function drag(node: HTMLElement, callback: (event: MouseEvent) => void) {
		const mousedown = (event) => {
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
			}
		};
	}

	function touchDrag(node: HTMLElement, callback: (event: TouchEvent) => void) {
		const touchdown = (event) => {
			if (event.targetTouches.length > 1) return;

			event.preventDefault();

			dragging = true;

			const ontouchend = () => {
				dragging = false;

				window.removeEventListener('touchmove', callback, false);
				window.removeEventListener('touchend', ontouchend, false);
			};

			window.addEventListener('touchmove', callback, false);
			window.addEventListener('touchend', ontouchend, false);
		};

		node.addEventListener('touchstart', touchdown, false);

		return {
			destroy() {
				node.removeEventListener('touchstart', touchdown, false);
			}
		};
	}
</script>

<div bind:this={container} class={className} role="separator" use:drag={setPos} use:touchDrag={setTouchPos} />
