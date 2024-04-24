<script lang="ts">
	import { Button } from '@margins/ui';
	import ShadowDomWrapper from './shadow-dom-wrapper.svelte';
	export let zIndex = 9999;
	export let trackMouseMove = false;

	// TODO: a mode that only defaults to just block-level eleements (like Arc behavior)
	// export let blockMode = false;

	let lastEl: Element | null = null;

	// TODO: drag to select a box and get element

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
</script>

<svelte:document
	on:mousemove={(e) => {
		if (trackMouseMove) {
			if (lastEl) {
				lastEl.removeAttribute('data-margins-inspector-selected');
				if (lastEl instanceof HTMLElement)
					lastEl.style.removeProperty('--margins-inspector-position');
			}
			const el = document.elementFromPoint(e.x, e.y);
			lastEl = normalizeElement(el);
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
		box-shadow: inset 0 0 0 calc(2px + 1px) rgb(120 113 108);
		inset: 0;
	}
</style>
