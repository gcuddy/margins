<script lang="ts">
	import type { PageData } from './$types';
	import VirtualList from 'svelte-tiny-virtual-list';
	import InfiniteLoading from 'svelte-infinite-loading';
	import { stripTags } from '$lib/utils/sanitize';
	import Muted from '$lib/components/atoms/Muted.svelte';
	import RssListItem from '../RSSListItem.svelte';

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

<div bind:clientHeight={height} class="h-full overflow-auto lg:col-span-3">
	<VirtualList width="100%" {height} itemCount={data.items.length} itemSize={80}>
		<div slot="header">
			{data.items.length} items
		</div>
		<div slot="item" let:index let:style {style}>
			{@const item = data.items[index]}
			<RssListItem {item} />
		</div>
		<div slot="footer"><InfiniteLoading distance={200} on:infinite={infiniteHandler} /></div>
	</VirtualList>
</div>
