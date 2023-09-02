<script lang="ts">
	import { onMount, tick } from 'svelte';

	export let clamp: 1 | 2 | 3 | 4 | 5 | 6 = 2;
	let el: HTMLElement;

	let is_clamped = true;

	let show_more = false;

	onMount(async () => {
        if (el) {
            await tick();
            console.log({el})
            is_clamped = el.scrollHeight > el.clientHeight;
        }
	});

	let className: string | undefined | null = null;

	export { className as class };
</script>

<div bind:this={el} style:--line-clamp={clamp} class:clamp={!show_more} class={className}>
	<slot {is_clamped} />
	<slot name="button">
		{#if is_clamped}
			<button class="clamp-toggle px-1 font-medium bg-popover/90 absolute bottom-0 right-0" on:click={() => (show_more = !show_more)}>
				{show_more ? 'Less' : 'More'}
			</button>
		{/if}
	</slot>
</div>

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
