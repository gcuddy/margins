<script lang="ts" context="module">
	export const currentFeedList = writable<{
		title: string;
		href: string;
		items: RssFeedItem[];
		activeItem?: RssFeedItem;
	}>();
</script>

<script lang="ts">
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Button from '$lib/components/Button.svelte';
	import { modals } from '$lib/stores/modals';
	import UrlModal from '$lib/components/modals/URLModal.svelte';
	import Form from '$lib/components/Form.svelte';
	import { page } from '$app/stores';
	import { syncStore } from '$lib/stores/sync';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import { sortItemsFromFeeds } from '$lib/utils/rss';
	import type { RssFeedItem } from '@prisma/client';
	import { feedStore } from './_stores';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import Header from '$lib/components/layout/Header.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';

	export let data: PageData;
	let { feeds } = data;
	feedStore.set(feeds);
	console.log({ feeds });
	let pending_sync = false;
	let sync_id: string;
</script>

<Header>
	<DefaultHeader>
		<div slot="start" class="flex items-center justify-between">
			<SmallPlus>{$page.data.currentSubscriptionTitle || 'Feeds'}</SmallPlus>
		</div>
		<div slot="end" class="flex space-x-3">
			{#if $currentFeedList}
				<Button
					variant="ghost"
					className="!px-1"
					tooltip={{
						text: 'Mark all as read'
					}}
					on:click={async () => {
						$currentFeedList.items?.forEach((feed) => {
							feed.is_read = true;
						});
						// await fetch('/rss/mark-all-as-read', {
						// 	method: 'POST'
						// });
					}}
				>
					<Icon name="checkCircleSolid" />
				</Button>
			{/if}
			<Form
				action="/rss/refresh.json"
				invalidate="/rss"
				pending={() => (sync_id = syncStore.addItem())}
				done={() => syncStore.removeItem(sync_id)}
				className="hidden md:block"
			>
				<Button
					type="submit"
					variant="ghost"
					tooltip={{
						text: 'Refresh feeds'
					}}
				>
					<Icon name="refreshSolid" />
					<span class="sr-only">Refresh Feeds</span></Button
				>
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

<div class="grid-cols-12 overflow-auto lg:grid">
	<div class="col-span-3">
		<ul>
			<li
				class="hidden h-10 flex-col justify-center border-b border-gray-100 px-4 dark:border-gray-700 md:flex md:px-6"
			>
				<a href="/rss?filter=all">All</a>
			</li>
			<li
				class="hidden h-10 flex-col justify-center border-b border-gray-100 px-4 dark:border-gray-700 md:flex md:px-6"
			>
				<a href="/rss/unread">Unread</a>
			</li>
			{#each feeds as feed (feed.id)}
				<li
					class="flex h-10 flex-col justify-center border-b border-gray-100 px-4 dark:border-gray-700 md:px-6"
				>
					<a href="/rss/{feed.id}">{feed.title}</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
