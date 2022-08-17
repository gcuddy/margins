<!-- <script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ fetch, url, props, stuff }) => {
		// use fetch
		const response = await fetch('/rss/feeds.json', {
			method: 'GET'
		});
		console.log({ response });
		if (!response.ok) {
			return {
				status: response.status
			};
		}
		const { feeds } = await response.json();
		// const feeds = [];
		// console.log({ feeds });
		const filter = url.searchParams.get('filter');
		console.log({ props });
		console.log({ stuff });
		console.log('test test toot toot');
		return {
			props: {
				filter,
				feeds
			},
			stuff: {
				filter
			},
			cache: {
				maxage: 60 * 5,
				private: true
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
</script> -->
<script lang="ts">
	import type { RssFeed } from '@prisma/client';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Button from '$lib/components/Button.svelte';
	import { modals } from '$lib/stores/modals';
	import UrlModal from '$lib/components/modals/URLModal.svelte';
	import Form from '$lib/components/Form.svelte';
	import { page } from '$app/stores';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import { syncStore } from '$lib/stores/sync';
	import FavoriteStar from '$lib/components/FavoriteStar.svelte';
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

	let pending_sync = false;
	let sync_id: string;
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
				{#if $page.url.pathname === '/rss'}
					<div class="text-gray-500">Feeds</div>
				{:else}
					<div class="flex flex-col text-sm sm:flex-row sm:space-x-1">
						<a sveltekit:prefetch class="flex items-center space-x-2 text-gray-300" href="/rss"
							><span>Feeds</span></a
						>
						<span class="text-gray-500">› {$page.stuff.currentFeed?.title}</span>
						<FavoriteStar
							starred={!!$page.stuff.currentFeed?.favorite}
							favorite_id={$page.stuff.currentFeed?.favorite?.id}
							data={{
								rssId: $page.stuff.currentFeed?.id
							}}
						/>
					</div>
				{/if}
			</div>
			<div slot="end" class="flex space-x-3">
				<Form
					action="/rss/refresh.json"
					invalidate="/rss"
					pending={() => (sync_id = syncStore.addItem())}
					done={() => syncStore.removeItem(sync_id)}
					className="hidden md:block"
				>
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
	<!-- <pre>{feeds}</pre> -->
	<slot {feeds} />
</div>
