<script lang="ts">
	import { Button } from '@margins/ui';
	import ShadowDomWrapper from './shadow-dom-wrapper.svelte';
	export let zIndex = 9999;
	let trackMouseMove = false;
	let lastEl: Element | null = null;

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
			}
			const el = document.elementFromPoint(e.x, e.y);
			lastEl = normalizeElement(el);
			console.log({ lastEl });
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
		outline: 2px solid red;
		pointer-events: none !important;
		/* display: block; */
	}
</style>
