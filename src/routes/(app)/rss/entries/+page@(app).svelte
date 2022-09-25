<script lang="ts">
	import type { PageData } from './$types';
	import VirtualList from 'svelte-tiny-virtual-list';
	import InfiniteLoading from 'svelte-infinite-loading';
	import Muted from '$lib/components/atoms/Muted.svelte';
	import RssListItem from '../RSSListItem.svelte';
	import KeyboardNav from '$lib/components/helpers/KeyboardNav/KeyboardNav.svelte';
	import KeyboardNavItem from '$lib/components/helpers/KeyboardNav/KeyboardNavItem.svelte';

	let loading = false;
	export let data: PageData;
	$: console.log({ data });
	let height: number;

	async function infiniteHandler({ detail: { complete, error, loaded } }) {
		try {
			console.log('trying to fetch');
			// fetch next entries
			const url = `/rss/entries.json?cursor=${data.cursor}`;
			console.log({ url });
			const res = await fetch(url);
			const { items, cursor } = await res.json();
			if (items.length) {
				console.log({ items, cursor });
				data.items = [...data.items, ...items];
				data.cursor = cursor;
				loaded();
			} else {
				complete();
			}
		} catch (e) {
			error();
		}
	}
</script>

<div
	bind:offsetHeight={height}
	class="h-full flex-grow overflow-visible overflow-x-hidden lg:col-span-3"
>
	<KeyboardNav items={data.items}>
		<VirtualList {height} itemCount={data.items.length} itemSize={80}>
			<div slot="header">
				{data.items.length} items
			</div>
			<div slot="item" let:index let:style {style}>
				{@const item = data.items[index]}
				<KeyboardNavItem {index} class="focus-within:bg-red-400 focus-visible:bg-red-400">
					<RssListItem {item} />
				</KeyboardNavItem>
			</div>
			<div slot="footer"><InfiniteLoading distance={200} on:infinite={infiniteHandler} /></div>
		</VirtualList>
	</KeyboardNav>
</div>
