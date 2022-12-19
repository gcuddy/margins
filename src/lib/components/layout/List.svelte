<script lang="ts">
	import InfiniteLoading from 'svelte-infinite-loading';
	import type { InfiniteEvent } from 'svelte-infinite-loading';
	import KeyboardNav from '../helpers/KeyboardNav/KeyboardNav.svelte';
	import KeyboardNavItem from '../helpers/KeyboardNav/KeyboardNavItem.svelte';
	import { preloadData } from '$app/navigation';
	import { dndzone } from 'svelte-dnd-action';
	import VirtualList from '../virtual-list/VirtualList.svelte';
	let height: number;
	type T = $$Generic<{ id: number }>;
	export let items: T[] = [];
	export let itemSize = 48;
	// TODO: type
	export let infiniteHandler: undefined | InfiniteEvent = undefined;
	export let href: (item: T) => string;
	export let preload = true;
	export let dnd_active = true;
</script>

<!-- TODO: incorporate view options? -->
<!-- <slot item={items[0]} /> -->
<!-- goal: make a component that allows for easy slots for custom list items, uses virtual lists, supports drag and drop, and supports keboard navigation, as well as, like linear  -->
<!-- can keyboard nav and dnd share the same state? -->
<!-- also want to have select actions work — not sure we can do that unless we keep in same component -->
<div bind:offsetHeight={height} class="h-full flex-grow overflow-visible overflow-x-hidden">
	<KeyboardNav class="h-full">
		<VirtualList
			{height}
			itemCount={items.length}
			{itemSize}
			use={[
				[
					dndzone,
					{
						items,
					},
				],
			]}
		>
			<div slot="item" let:index let:style {style}>
				{@const _href = href(items[index])}
				<KeyboardNavItem
					{index}
					as="a"
					class="focus-within:bg-red-400 focus-visible:bg-red-400"
					href={_href}
					on:active={() => {
						if (preload) {
							preloadData(_href);
						}
					}}
				>
					<slot item={items[index]} />
				</KeyboardNavItem>
			</div>

			<div slot="footer">
				{#if infiniteHandler}<InfiniteLoading distance={200} on:infinite={infiniteHandler} />
				{/if}
			</div>
		</VirtualList>
	</KeyboardNav>
</div>
