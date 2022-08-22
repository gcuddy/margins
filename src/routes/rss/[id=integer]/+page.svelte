<script lang="ts">
	import type { FeedWithItems } from '$lib/types';
	import type { PageData } from './$types';
	import Item from './_Item.svelte';
	export let data: PageData;
	let { feed } = data;
</script>

<ul class="overflow-auto">
	{#each feed.items as item (item.id)}
		<li>
			<Item {item} />
		</li>
	{/each}
</ul>
