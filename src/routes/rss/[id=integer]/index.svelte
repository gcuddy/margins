<script lang="ts" context="module">
	export const load: Load = async ({ props }) => {
		const { feed } = props;
		console.log({ feed });
		return {
			stuff: {
				currentFeed: feed
			},
			props: {
				feed
			}
		};
	};
</script>

<script lang="ts">
	import type { FeedWithItems } from '$lib/types';
	import type { Load } from '@sveltejs/kit';
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
