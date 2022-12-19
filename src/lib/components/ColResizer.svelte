<script lang="ts">
	import { clamp } from '$lib/utils';

	let className = '';
	export { className as class };
	export let width: number;
	export let max = 400;
	export let min = 200;

	let dragging = false;
	// let pos: number;
	// $: pos = clamp(pos, min, max);

	function setPos(event: MouseEvent) {
		const posChange = (width - event.clientX) * -1;
		const pos = clamp(width + posChange, min, max);
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
			},
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
			},
		};
	}
</script>

<div class={className} role="separator" use:drag={setPos} use:touchDrag={setTouchPos} />
