<script lang="ts">
	import type { FeedWithItems } from '$lib/types';
	import Item from './_Item.svelte';
	export let feed: FeedWithItems;
	console.log({ feed });
</script>

<ul>
	{#each feed.items as item (item.id)}
		<li>
			<Item {item} />
		</li>
	{/each}
</ul>
