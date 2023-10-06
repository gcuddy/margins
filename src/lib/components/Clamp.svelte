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

	onMount(async () => {
		if (el) {
			await tick();
			console.log({ el });
			is_clamped = el.scrollHeight > el.clientHeight;
		}
	});

	$: if (el) {
		is_clamped = el.scrollHeight > el.clientHeight;
		if (is_clamped) {
			clamped_height.set(el.clientHeight, {
				duration: 0,
			});
		}
		console.log({ is_clamped });
	}

	let className: string | undefined | null = null;

	export { className as class };

	export let as = 'div';
</script>

<svelte:element
	this={as}
	bind:this={el}
    style:--height={is_clamped ? undefined: `${$clamped_height}px`}
	style:--line-clamp={clamp}
	class:clamp={!show_more}
	class={cn('relative', className)}
>
	<slot {is_clamped} />
	<slot name="button">
		{#if is_clamped}
			<button
				class="clamp-toggle px-1 font-medium bg-popover/90 absolute bottom-0 right-0"
				on:click={() => (show_more = !show_more)}
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
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: var(--line-clamp);
	}
</style>
