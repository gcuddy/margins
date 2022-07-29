<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ fetch, url, props, stuff }) => {
		// use fetch
		// const response = await fetch('/feeds.json', {
		// 	method: 'GET'
		// });
		// if (!response.ok) {
		// 	return {
		// 		status: response.status
		// 	};
		// }
		// // const { feeds } = await response.json();
		// const feeds = [];
		// console.log({ feeds });
		const filter = url.searchParams.get('filter');
		console.log({ props });
		console.log({ stuff });
		console.log('test test toot toot');
		return {
			props: {
				filter
			},
			stuff: {
				filter
			}
		};
		// const feeds = await getFeeds();
		// console.log({ feeds });
		// const feeds = await fetch('/rss/feeds.json').then((res) => res.json());
		// console.log(`load function /rss/__layout`, { feeds });
		// return {
		// 	props: feeds
		// };
	};
</script>

<script lang="ts">
	import type { RssFeed } from '@prisma/client';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Button from '$lib/components/Button.svelte';
	import { modals } from '$lib/stores/modals';
	import UrlModal from '$lib/components/modals/URLModal.svelte';
	import Form from '$lib/components/Form.svelte';
	import { page } from '$app/stores';
	const all = [
		{
			href: '/rss',
			text: 'All',
			id: -1
		}
	];
	export let feeds: RssFeed[] = [];
	export let filter: 'all' | 'unread' = 'all';
	console.log({ feeds });
</script>

<div class="flex flex-col overflow-hidden">
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
			<div slot="end" class="flex space-x-3">
				<Form action="/rss/refresh.json" invalidate="/rss">
					<Button type="submit" variant="ghost">Refresh Feeds</Button>
				</Form>
				<Button
					on:click={() => {
						// TODO: turn this into form so it can re-direct to JS-less page
						console.log('click');
						modals.open(UrlModal, {
							formAction: '/rss',
							placeholder: 'Enter RSS feed URL',
							name: 'url',
							invalidate: $page.url.pathname
						});
					}}
					variant="ghost">Add Feed</Button
				>
			</div>
		</DefaultHeader>
	</Header>
	<slot {feeds} />
</div>
