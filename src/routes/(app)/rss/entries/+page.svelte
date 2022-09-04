<script lang="ts">
	import type { PageData } from './$types';
	import VirtualList from 'svelte-tiny-virtual-list';
	import InfiniteLoading from 'svelte-infinite-loading';
	import { stripTags } from '$lib/utils/sanitize';

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

<div bind:clientHeight={height} class="col-span-3 h-full overflow-auto">
	<VirtualList width="100%" {height} itemCount={data.items.length} itemSize={80}>
		<div slot="header">
			{data.items.length} items
		</div>
		<div slot="item" let:index let:style {style}>
			{@const item = data.items[index]}
			<div class="flex flex-col overflow-hidden">
				<span><a href="/rss/{item.feed.id}/{item.uuid}">{item.title}</a></span>
				<span>{item.feed.title}</span>
				<!-- <span class="line-clamp-2">{description || contentSnippet}</span> -->
			</div>
		</div>
		<div slot="footer"><InfiniteLoading distance={200} on:infinite={infiniteHandler} /></div>
	</VirtualList>
</div>
