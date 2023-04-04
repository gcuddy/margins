<script lang="ts">
	import { onMount } from "svelte";
	import { createWindowVirtualizer } from "@tanstack/svelte-virtual";
	import { afterUpdate } from "svelte";
	let parentOffset = 0;
	let virtualizer: SvelteVirtualizer;

	let items = [];
	let el: HTMLElement;
	afterUpdate(() => {
		console.log("after update");
		parentOffset = el?.offsetTop;
		console.log({ parentOffset });
	});

	onMount(() => {
		virtualizer = createWindowVirtualizer({
			count: 1000,
			estimateSize: () => 40,
			scrollMargin: parentOffset,
			overscan: 5,
		});
		items = $virtualizer.getVirtualItems();
	});
</script>

<div bind:this={el}>
	{#if virtualizer}
		<div class="relative w-full" style:height="{$virtualizer.getTotalSize()}px">
			<div
				style:--translate="{items[0].start -
					$virtualizer.options.scrollMargin}px"
				class="absolute left-0 top-0 w-full translate-y-[--translate]"
			>
				{#each items as item (item.key)}
					<div class="p-10">{item.index}</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
