<script lang="ts">
	import type { PageData } from './$types';
	import RssListItem from '../RSSListItem.svelte';
	export let data: PageData;
	$: items = data.items;
	$: console.log({ data });
</script>

<ul class="overflow-auto lg:col-span-3">
	{#each items as item (item.id)}
		<li>
			<RssListItem {item} />
		</li>
	{/each}
</ul>
