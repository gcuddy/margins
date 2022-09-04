<script lang="ts">
	import type { PageData } from './$types';
	import RssListItem from '../RSSListItem.svelte';
	export let data: PageData;
	$: items = data.items;
	$: console.log({ data });
</script>

<ul class="col-span-3 overflow-auto">
	{#each items as item (item.id)}
		<li>
			<RssListItem {item} />
		</li>
	{/each}
</ul>
