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
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Button from '$lib/components/Button.svelte';
	import { modals } from '$lib/stores/modals';
	import UrlModal from '$lib/components/modals/URLModal.svelte';
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

	<Header>
		<DefaultHeader>
			<div slot="start">
				<h1>RSS</h1>
			</div>
			<div slot="end">
				<Button
					on:click={() => {
						// TODO: turn this into form so it can re-direct to JS-less page
						modals.open(UrlModal, {
							formAction: '/rss',
							placeholder: 'Enter RSS feed URL',
							name: 'url',
							invalidate: '/rss'
						});
					}}
					variant="ghost">Add Feed</Button
				>
			</div>
		</DefaultHeader>
	</Header>
	<slot />
</div>
