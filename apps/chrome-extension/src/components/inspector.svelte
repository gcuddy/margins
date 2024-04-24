<script lang="ts">
	import { Button } from '@margins/ui';
	import ShadowDomWrapper from './shadow-dom-wrapper.svelte';
	import { tick } from 'svelte';

	export let zIndex = 9999;
	export let trackMouseMove = false;

	// TODO: a mode that only defaults to just block-level eleements (like Arc behavior)
	export let blockMode = true;
	export let dragToSelect = false;

	let lastEl: Element | null = null;

	//  Drag state variables
	let dragging = false;
	let x = 0;
	let y = 0;
	let startingX = 0;
	let startingY = 0;
	$: width = Math.abs(x - startingX);
	$: height = Math.abs(y - startingY);
	$: computedStartingX = x - startingX > 0 ? startingX : x;
	$: computedStartingY = y - startingY > 0 ? startingY : y;

	function handleClick() {
		trackMouseMove = !trackMouseMove;
	}

	function normalizeElement(el: Element | null) {
		let curEl = el;
		while (curEl) {
			if (curEl.tagName === 'A' || curEl.tagName === 'BUTTON') {
				return curEl;
			}
			curEl = curEl.parentElement;
		}
		return el;
	}

	function findNearestBlockLevelElement(el: Element | null) {
		let curEl = el;
		while (curEl) {
			const display = getComputedStyle(curEl).display;
			if (display.includes('inline') && blockMode) {
				const parent = curEl.parentElement;
				curEl = parent;
			} else {
				break;
			}
		}
		return curEl;
	}

	function disableTrackMouseMove() {
		if (lastEl) {
			lastEl.removeAttribute('data-margins-inspector-selected');
			if (lastEl instanceof HTMLElement)
				lastEl.style.removeProperty('--margins-inspector-position');
		}
		trackMouseMove = false;
	}

	function handlePointerdown(e: PointerEvent) {
		if (dragToSelect) return;
		dragging = true;
		disableTrackMouseMove();
		startingX = e.x;
		startingY = e.y;
	}

	function handleMouseMove(e: MouseEvent) {
		x = e.x;
		y = e.y;
	}

	function handlePointerup(e: PointerEvent) {
		if (dragToSelect) return;
		dragging = false;
		tick().then(() => {
			captureScreenshot();
		});
	}

	function downloadImage(dataUrl: string) {
		const a = document.createElement('a');
		a.href = dataUrl;
		a.download = 'screenshot.png';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	async function captureScreenshot() {
		if (!lastEl) return;
		const screenshot = await chrome.runtime.sendMessage({
			action: 'captureVisibleTab',
		});

		const image = new Image();
		image.src = screenshot;
		const { height, left, top, width } = lastEl.getBoundingClientRect();
		image.onload = () => {
			const canvas = document.createElement('canvas');
			const scale = window.devicePixelRatio;

			canvas.width = width * scale;
			canvas.height = height * scale;
			const ctx = canvas.getContext('2d');

			ctx!.drawImage(
				image,
				left * scale,
				top * scale,
				width * scale,
				height * scale,
				0,
				0,
				width * scale,
				height * scale,
			);

			const croppedImage = canvas.toDataURL();
			downloadImage(croppedImage);
			//Do stuff with your cropped image
		};
		// console.log({ height, screenshot, width, x, y });
		// return;
		// const img = new Image();
		// img.onload = function () {
		// 	const canvas = document.createElement('canvas');
		// 	const ctx = canvas.getContext('2d');
		// 	canvas.width = width;
		// 	canvas.height = height;
		// 	ctx?.drawImage(img, x, y, width, height, 0, 0, width, height);
		//
		// 	const croppedDataUrl = canvas.toDataURL('image/png');
		// 	downloadImage(croppedDataUrl);
		// };
		// img.src = screenshot;

		// const element = document.body;
		// const canvas = await html2canvas(element, {
		//      onclone
		//   });
		// console.log({ canvas });
		//
		// const croppedCanvas = document.createElement('canvas');
		// const ctx = croppedCanvas.getContext('2d');
		// croppedCanvas.width = width;
		// croppedCanvas.height = height;
		//
		// const $x = window.scrollX + computedStartingX;
		// const $y = window.scrollY + computedStartingY;
		//
		// ctx?.drawImage(canvas, $x, $y, width, height, 0, 0, width, height);
		// document.body.appendChild(croppedCanvas);
		//
		// // const imageUrl = croppedCanvas.toDataURL();
		// const link = document.createElement('a');
		// link.setAttribute('download', 'screenshot.png');
		// link.setAttribute(
		// 	'href',
		// 	croppedCanvas
		// 		.toDataURL('image/png')
		// 		.replace('image/png', 'image/octet-stream'),
		// );
		// link.click();

		// const replacedImageUrl = imageUrl.replace(
		// 	'image/png',
		// 	'image/octet-stream',
		// );
		// window.location.href = replacedImageUrl;
	}
</script>

<svelte:document
	on:pointerdown={handlePointerdown}
	on:pointerup={handlePointerup}
	on:click={(e) => {
		captureScreenshot();
	}}
	on:mousemove={(e) => {
		if (dragging) {
			handleMouseMove(e);
		}
		if (trackMouseMove) {
			if (lastEl) {
				lastEl.removeAttribute('data-margins-inspector-selected');
				if (lastEl instanceof HTMLElement)
					lastEl.style.removeProperty('--margins-inspector-position');
			}
			const el = document.elementFromPoint(e.x, e.y);
			// lastEl = normalizeElement(el);
			lastEl = findNearestBlockLevelElement(el);
			if (!lastEl) return;
			const position = getComputedStyle(lastEl).position;
			if (lastEl instanceof HTMLElement && position === 'static') {
				lastEl.style.setProperty('--margins-inspector-position', 'relative');
			}
			lastEl?.setAttribute('data-margins-inspector-selected', 'true');
		}
	}}
/>

<ShadowDomWrapper>
	<div style:z-index={zIndex} class="fixed bottom-4 right-4 bg-white p-4">
		<Button on:click={handleClick}>Click me to start inspecting</Button>
	</div>
	{#if dragging}
		<svg style:z-index={zIndex} class="fixed inset-0 h-full w-full">
			<rect
				stroke="transparent"
				stroke-width="1"
				fill="green"
				fill-opacity="0.05"
				x={computedStartingX}
				y={computedStartingY}
				{width}
				{height}
			/>
		</svg>
	{/if}
</ShadowDomWrapper>

<style>
	:global([data-margins-inspector-selected]) {
		/* outline: 2px solid red; */
		pointer-events: none !important;
		position: var(--margins-inspector-position, relative);
		/* display: block; */
	}

	:global([data-margins-inspector-selected])::before {
		content: '';
		position: absolute;
		height: 100%;
		width: 100%;
		box-shadow: inset 0 0 0 calc(2px + 1px) hsl(43 86% 66%);
		inset: 0;
	}

	:global(img[data-margins-inspector-selected]) {
		box-shadow: 0 0 0 calc(3px + 1px) hsl(43 86% 66%);
	}
</style>
