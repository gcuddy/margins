<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import type { Placement } from '@popperjs/core';
	import { onDestroy, onMount } from 'svelte';
	import { createPopperActions } from 'svelte-popperjs';
	import { fly } from 'svelte/transition';
	import TooltipContent from './TooltipContent.svelte';

	export let ref: HTMLElement;
	export let placement: Placement = 'top';
    export let delay = 500;

	const [popperRef, popperContent] = createPopperActions({
		placement,
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 4]
				}
			}
		],
		strategy: 'fixed'
	});

	let render = false;

	let event_listeners_setup = false;
	const setup_events = () => {
		console.log({ ref });
		popperRef(ref);
		ref.addEventListener('pointermove', pointermove);
		ref.addEventListener('pointerleave', hide);
		ref.addEventListener('pointerdown', hide);
		ref.addEventListener('focus', show);
		ref.addEventListener('blur', hide);
		ref.addEventListener('click', hide);
		event_listeners_setup = true;
	};

	const show = () => {
		render = true;
	};
	const hide = () => (render = false);

	const pointermove = (event: PointerEvent) => {
		if (event.pointerType === 'touch') return;
		render = true;
	};

	onMount(() => {
		if (ref) {
			setup_events();
		}
	});

	$: if (ref && !event_listeners_setup) setup_events();

	onDestroy(() => {
		if (ref) {
			ref.removeEventListener('pointermove', pointermove);
			ref.removeEventListener('pointerleave', hide);
			ref.removeEventListener('pointerdown', hide);
			ref.removeEventListener('focus', show);
			ref.removeEventListener('blur', hide);
			ref.removeEventListener('click', hide);
		}
	});

	$: x = placement.startsWith('left') ? 4 : placement.startsWith('right') ? -4 : 0;
	$: y = placement.startsWith('top') ? 4 : placement.startsWith('bottom') ? -4 : 0;
</script>

{#if render}
		<TooltipContent {popperContent} {delay} {x} {y}>
			<slot />
		</TooltipContent>
{/if}
