<script lang="ts">
	import AnnotationInput from './AnnotationInput.svelte';
	import { portal } from 'svelte-portal/src/Portal.svelte';
	import { fly, fade } from 'svelte/transition';
	import { createEventDispatcher, onMount } from 'svelte';
	import { Focus, focusIn } from '$lib/utils/focus-management';
	import { onDestroy } from 'svelte';
	export let value = '';
	export let el: HTMLElement;
	const dispatch = createEventDispatcher();
	let container: HTMLElement;

	$: console.log({ el });
	// export let container: HTMLElement;
	// $: top = rect.top + container.scrollTop;
	// $: left = rect.left + rect.width / 2 - container.offsetLeft;
	function calculateLeftOrRight(): 'left' | 'right' | 'center' | void {
		if (!container) return;
		console.log('calculating pos');
		const { left, right, width } = el.getBoundingClientRect();
		console.log({
			left,
			right,
			width,
			clientWidth: document.body.clientWidth,
			containerWidth: container.offsetWidth
		});
		console.log(document.body.clientWidth - right < container.offsetWidth + 10);
		if (document.body.clientWidth - (container.offsetWidth + width) < 0) {
			return 'center';
		}
		if (right - container.offsetWidth > 0) {
			return 'right';
		} else if (left + container.offsetWidth < document.body.clientWidth) {
			return 'left';
		} else {
			return 'center';
		}
	}

	const setPos = () => {
		if (container) {
			requestAnimationFrame(() => (pos = calculateLeftOrRight()));
		}
	};

	$: pos = calculateLeftOrRight();
	onMount(() => {
		focusIn(container, Focus.First);
		if (container) {
			pos = calculateLeftOrRight();
		}
		document.addEventListener('resize', setPos);
	});
	onDestroy(() => {
		document.removeEventListener('resize', setPos);
	});
</script>

<!-- {pos === 'left'
		? 'left-0'
		: pos === 'right'
		? 'right-0'
		: ''} -->
<div
	use:portal={el}
	class="floating-annotation absolute z-20"
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			dispatch('cancel');
		}
	}}
>
	<AnnotationInput bind:el={container} bind:value on:save on:cancel />
</div>
