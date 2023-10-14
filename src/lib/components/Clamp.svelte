<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount, tick } from 'svelte';
	import { tweened } from 'svelte/motion';

	export let clamp: 1 | 2 | 3 | 4 | 5 | 6 = 2;
	let el: HTMLElement;

	let is_clamped = true;

	let show_more = false;

	const clamped_height = tweened(0, {
		duration: 200,
	});

    export let fromClass ="from-card";

	onMount(async () => {
		if (el) {
			await tick();
			console.log({ el });
			is_clamped = el.scrollHeight > el.clientHeight;
		}
	});

	let lineHeight = 20;

	// estimate max height based on clamp
	let maxHeight = lineHeight * clamp;

	let actualMaxHeight = 100;

	$: if (el) {
		is_clamped = el.scrollHeight > el.clientHeight;
		lineHeight = parseInt(getComputedStyle(el).lineHeight);
		actualMaxHeight = el.scrollHeight;
		console.log({
			lineHeight,
			actualMaxHeight,
			scrollHeight: el.scrollHeight,
			clientHeight: el.clientHeight,
		});
		if (is_clamped) {
			clamped_height.set(el.clientHeight, {
				duration: 0,
			});
		}
		console.log(`is_clamped`, is_clamped);
	}

	$: max_height = is_clamped
		? `${lineHeight * clamp}px`
		: `${actualMaxHeight}px`;
	$: console.log({ max_height, actualMaxHeight });

	let className: string | undefined | null = null;

	export { className as class };

	export let as = 'div';
</script>

<!-- style:max-height="{height}px" -->

<svelte:element
	this={as}
	bind:this={el}
	style:--line-clamp={clamp}
	class:clamped={!show_more}
	style:--line-height={lineHeight}
	class={cn('clamp relative transition-[max-height]', className)}
	style:max-height={!show_more
		? `${lineHeight * clamp}px`
		: `${actualMaxHeight}px`}
>
	<slot {is_clamped} />
	<slot name="button">
		{#if is_clamped}
			<button
				class="clamp-toggle px-1 font-medium absolute bottom-0 right-0 w-36 bg-gradient-to-l {fromClass} text-right underline hover:text-primary"
				on:click={() => (show_more = !show_more)}
                on:click
			>
				{show_more ? 'Less' : 'More'}
			</button>
		{/if}
	</slot>
</svelte:element>

<style lang="postcss">
	div {
		position: relative;
	}
	.clamp {
		transition-property: max-height, border-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}
	.clamped {
		overflow: hidden;
		/* display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: var(--line-clamp); */
	}
</style>
