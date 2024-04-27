<script lang="ts">
	import ShadowDomWrapper from './shadow-dom-wrapper.svelte';
	import { tick } from 'svelte';
	import { Command, Popover } from '@margins/ui';
	import { getCssSelector } from 'css-selector-generator';
	import { cn, sleep } from '@margins/lib';
	import { fade } from 'svelte/transition';
	import { createFloatingActions } from 'svelte-floating-ui';
	import { offset, flip, shift } from 'svelte-floating-ui/dom';
	import ClipboardCopy from 'lucide-svelte/icons/clipboard-copy';
	import Save from 'lucide-svelte/icons/save';
	import ListPlus from 'lucide-svelte/icons/list-plus';

	export let zIndex = 9999;
	export let trackMouseMove = true;

	// TODO: a mode that only defaults to just block-level eleements (like Arc behavior)
	export let blockMode = true;
	export let dragToSelect = true;
	export let isEnabled = true;

	let lastEl: HTMLElement | null = null;
	let rect: SVGRectElement | null = null;

	//  Drag state variables
	//
	// 0 for not dragging, 1 for dragging, 2 for captured, 3 for capturing
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

	$: if (dragState === 2) {
		isEnabled = false;
	} else {
		isEnabled = true;
	}

	const [floatingRef, floatingContent] = createFloatingActions({
		autoUpdate: true,
		middleware: [offset(6), flip(), shift()],
		placement: 'right',
		strategy: 'fixed',
	});

	function resetDragPos() {
		x = 0;
		y = 0;
		startingX = 0;
		startingY = 0;
		maybeDragging = false;
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

	let maybeDragging = false;

	function handlePointerdown(e: PointerEvent) {
		if (!isEnabled) return;
		if (!dragToSelect) return;
		startingX = e.x;
		startingY = e.y;
		maybeDragging = true;
		disableTrackMouseMove();
		console.log({ maybeDragging });
		// tick().then(() => {
		// 	setTimeout(() => {
		// 		console.log('timeout', { ticking });
		// 		if (ticking) return;
		// 		dragState = 1;
		// 		// console.log('pointer down');
		// 		disableTrackMouseMove();
		// 	}, 50);
		// });
	}

	function handleMouseMove(e: MouseEvent) {
		console.log('mouse move');
		if (!isEnabled) return;
		x = e.x;
		y = e.y;
		console.log('mouse move', maybeDragging);
		if (maybeDragging) {
			tick().then(() => {
				dragState = 1;
				disableTrackMouseMove();
			});
		}
	}
	let ticking = false;

	function handlePointerup(e: PointerEvent) {
		if (!isEnabled) return;
		// console.log('pointer up', { dragToSelect });
		if (dragState === 0) return;
		ticking = true;
		if (!dragToSelect) return;
		if (rect) {
			const { height, left, top, width } = rect.getBoundingClientRect();
			// NOTE: we set to 3 to indicate capturing state - this will make the rect disappear
			dragState = 3;
			resetDragPos();
			tick().then(async () => {
				await sleep(25);
				await captureScreenshot({
					height,
					width,
					x: left,
					y: top,
				});
				imageRect = {
					height,
					width,
					x: left,
					y: top,
				};
				dragState = 2;
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

	let dataImageUrl: string | null = null;
	let imageRect: {
		height: number;
		width: number;
		x: number;
		y: number;
	} | null = null;

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
			dataImageUrl = croppedImage;
			console.log({ croppedImage });
		};
		console.log({ image });
	}
</script>

<svelte:document
	on:pointerdown={handlePointerdown}
	on:pointerup={handlePointerup}
	on:click={(e) => {
		console.log('got click');
		if (!isEnabled) return;
		console.log('is enabled');
		if (!lastEl) return;
		console.log('last el');
		if (dragState === 1) return;
		console.log('drag state ok');
		if (ticking) return;
		ticking = true;
		console.log('got click');
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
		console.log('set screenshot');
		imageRect = {
			height,
			width,
			x: left,
			y: top,
		};
		console.log('set imageRect');
		dragState = 2;
		ticking = false;
	}}
	on:mousemove={(e) => {
		handleMouseMove(e);
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
	{#if isEnabled && dragState === 0}
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
	{#if dragState === 1}
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
	{#if dragState === 2 && dataImageUrl && imageRect}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="fixed inset-0 h-full w-full bg-black/20"
			on:click|self={() => {
				dragState = 0;
			}}
			style:z-index={zIndex}
		>
			{#if dataImageUrl && imageRect}
				<div
					use:floatingRef
					style:height="{imageRect.height}px"
					style:width="{imageRect.width}px"
					class="absolute overflow-hidden rounded bg-white ring-2 ring-lime-400"
					style:left="{imageRect.x}px"
					style:top="{imageRect.y}px"
				>
					<img src={dataImageUrl} alt="" />
				</div>
				<div class={cn(Popover.popoverVariants(), 'p-0')} use:floatingContent>
					<Command.PopoverContents
						autofocus
						commands={[
							{
								action: () => {
									alert('Save to library');
								},
								icon: Save,
								label: 'Save To Library',
							},
							{
								action: () => {},
								icon: ClipboardCopy,
								label: 'Copy',
							},
							{
								action: () => {},
								icon: ListPlus,
								label: 'Add to Collection...',
							},
						]}
					/>
				</div>
			{/if}
		</div>
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
