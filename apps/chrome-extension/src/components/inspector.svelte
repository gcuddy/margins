<script lang="ts">
	import ShadowDomWrapper from './shadow-dom-wrapper.svelte';
	import { tick } from 'svelte';
	import { Popover } from '@margins/ui';
	import { getCssSelector } from 'css-selector-generator';
	import { cn } from '@margins/lib';
	import { fade } from 'svelte/transition';

	export let zIndex = 9999;
	export let trackMouseMove = false;

	// TODO: a mode that only defaults to just block-level eleements (like Arc behavior)
	export let blockMode = true;
	export let dragToSelect = true;

	let lastEl: HTMLElement | null = null;
	let rect: SVGRectElement | null = null;

	//  Drag state variables
	//
	// 0 for not dragging, 1 for dragging, 2 for captured
	let dragState = 0;
	// $: console.log({ dragState });
	let x = 0;
	let y = 0;
	let startingX = 0;
	let startingY = 0;
	$: width = Math.abs(x - startingX);
	$: height = Math.abs(y - startingY);
	$: computedStartingX = x - startingX > 0 ? startingX : x;
	$: computedStartingY = y - startingY > 0 ? startingY : y;

	function resetDragPos() {
		x = 0;
		y = 0;
		startingX = 0;
		startingY = 0;
	}

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

	function findNearestBlockLevelElement(
		el: HTMLElement | null,
	): HTMLElement | null {
		let curEl = el;
		while (curEl) {
			const display = curEl.style.display ?? getComputedStyle(curEl).display;
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

	function setDragCss(add: boolean) {
		if (add) {
			document.documentElement.setAttribute(
				'data-margins-inspector-dragging',
				'true',
			);
		} else {
			document.documentElement.removeAttribute(
				'data-margins-inspector-dragging',
			);
		}
	}

	$: if (dragState === 1) {
		setDragCss(true);
	} else {
		setDragCss(false);
	}

	function handlePointerdown(e: PointerEvent) {
		if (!dragToSelect) return;
		dragState = 1;
		// console.log('pointer down');
		disableTrackMouseMove();
		startingX = e.x;
		startingY = e.y;
	}

	function handleMouseMove(e: MouseEvent) {
		x = e.x;
		y = e.y;
	}
	let ticking = false;

	function handlePointerup(e: PointerEvent) {
		// console.log('pointer up', { dragToSelect });
		ticking = true;
		if (!dragToSelect) return;
		if (rect) {
			const { height, left, top, width } = rect.getBoundingClientRect();
			// console.log({
			// 	height,
			// 	left,
			// 	top,
			// 	width,
			// });
			tick().then(async () => {
				dragState = 2;
				await captureScreenshot({
					height,
					width,
					x: left,
					y: top,
				});
				// resetDragPos();
				ticking = false;
			});
		}
	}

	function downloadImage(dataUrl: string) {
		const a = document.createElement('a');
		a.href = dataUrl;
		a.download = 'screenshot.png';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	async function captureScreenshot({
		height,
		width,
		x,
		y,
	}: {
		height: number;
		width: number;
		x: number;
		y: number;
	}) {
		if (!lastEl) return;
		lastEl.removeAttribute('data-margins-inspector-selected');
		lastEl.style.removeProperty('--margins-inspector-position');
		// await tick();
		const screenshot = await chrome.runtime.sendMessage({
			action: 'captureVisibleTab',
		});

		const image = new Image();
		image.src = screenshot;
		image.onload = () => {
			const canvas = document.createElement('canvas');
			const scale = window.devicePixelRatio;

			canvas.width = width * scale;
			canvas.height = height * scale;
			const ctx = canvas.getContext('2d');

			ctx!.drawImage(
				image,
				x * scale,
				y * scale,
				width * scale,
				height * scale,
				0,
				0,
				width * scale,
				height * scale,
			);

			const croppedImage = canvas.toDataURL();
			console.log({ croppedImage });
		};
		console.log({ image });
	}
</script>

<svelte:document
	on:pointerdown={handlePointerdown}
	on:pointerup={handlePointerup}
	on:click={(e) => {
		if (!lastEl) return;
		if (dragState === 0) return;
		if (ticking) return;
		// console.log('got click');
		e.preventDefault();
		e.stopImmediatePropagation();
		const sel = getCssSelector(lastEl);
		const { height, left, top, width } = lastEl.getBoundingClientRect();
		captureScreenshot({
			height,
			width,
			x: left,
			y: top,
		});
	}}
	on:mousemove={(e) => {
		if (dragState === 1) {
			handleMouseMove(e);
		}
		if (trackMouseMove) {
			if (lastEl) {
				lastEl.removeAttribute('data-margins-inspector-selected');
				lastEl.style.removeProperty('--margins-inspector-position');
			}
			const el = document.elementFromPoint(e.x, e.y);
			// lastEl = normalizeElement(el);
			if (!(el instanceof HTMLElement)) return;
			lastEl = findNearestBlockLevelElement(el);
			if (!lastEl) return;
			const position =
				lastEl.style.position || getComputedStyle(lastEl).position;
			if (lastEl instanceof HTMLElement && position === 'static') {
				lastEl.style.setProperty('--margins-inspector-position', 'relative');
			}
			lastEl?.setAttribute('data-margins-inspector-selected', 'true');
		}
	}}
/>

<ShadowDomWrapper>
	{#if dragState === 0}
		<div
			transition:fade={{ duration: 150 }}
			style:z-index={zIndex}
			class={cn(
				Popover.popoverVariants(),
				'fixed bottom-4 left-1/2 right-1/2 -translate-x-1/2',
			)}
		>
			<span class="text-lg font-medium tracking-tight">
				Click or drag to capture
			</span>
		</div>
	{/if}
	{#if dragState === 1 || dragState === 2}
		<svg style:z-index={zIndex} class="fixed inset-0 h-full w-full">
			<rect
				bind:this={rect}
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

	:global(
			img[data-margins-inspector-selected],
			input[data-margins-inspector-selected]
		) {
		box-shadow: 0 0 0 calc(3px + 1px) hsl(43 86% 66%);
	}

	:global([data-margins-inspector-dragging]) {
		user-select: none;
		overflow: hidden;
	}
</style>
