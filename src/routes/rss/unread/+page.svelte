<script lang="ts">
	import type { PageData } from '.svelte-kit/types/src/routes/rss/unread/$types';
	import { currentFeedList } from '../+page.svelte';
	import RssListItem from '../RSSListItem.svelte';
	export let data: PageData;
	$: items = data.items;
	$: console.log({ data });
	$: currentFeedList.set({
		items,
		title: 'Unread',
		href: '/rss/unread'
	});
</script>

<ul class="overflow-auto">
	{#each items as item (item.id)}
		<li>
			<RssListItem {item} />
		</li>
	{/each}
</ul>
