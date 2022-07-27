<script lang="ts">
	import type { FeedWithItems } from '$lib/types';
	import Item from './_Item.svelte';
	export let feed: FeedWithItems;
	console.log({ feed });
</script>

<div>
	{#each feed.items as item}
		<Item {item} />
	{/each}
</div>
