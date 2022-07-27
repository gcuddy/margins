<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ fetch }) => {
		const feeds = await fetch('/rss/feeds.json').then((res) => res.json());
		return {
			props: feeds
		};
	};
</script>

<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import type { RssFeed } from '@prisma/client';
	const all = [
		{
			href: '/rss',
			text: 'All',
			id: -1
		}
	];
	export let feeds: RssFeed[] = [];
</script>

<div>
	<!-- <Sidebar
		links={all.concat(
			feeds.map((f) => {
				return {
					href: `/rss/${f.id}`,
					text: f.title,
					id: f.id
				};
			})
		)}
	/> -->
	<slot />
</div>
