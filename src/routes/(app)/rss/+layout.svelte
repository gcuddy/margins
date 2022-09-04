<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Button from '$lib/components/Button.svelte';
	import { modals } from '$lib/stores/modals';
	import UrlModal from '$lib/components/modals/URLModal.svelte';
	import Form from '$lib/components/Form.svelte';
	import { page } from '$app/stores';
	import { syncStore } from '$lib/stores/sync';
	import { user_data_dirty, user as userStore } from '$lib/stores/user';

	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import { lastFeedRefresh } from '$lib/stores/feeds';
	import { onMount } from 'svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import type { LayoutData } from './$types';
	import { notifications } from '$lib/stores/notifications';
	import { goto } from '$app/navigation';
	import { panes } from './store';
	import { tick } from 'svelte';
	export let data: LayoutData;
	$: user = data.user;
	$: ({ feeds } = $user);
	let pending_sync = false;
	let sync_id: string;
	onMount(async () => {
		// refresh feeds

		// if lastFeedRefresh is not less than 2 minutes ago, don't refresh feeds
		// if ($lastFeedRefresh < Date.now() - 2 * 60 * 1000) return;
		// set last refresh feeds to now
		// TODO: only refresh if last refresh is more than 2 minutes ago
		console.log('refreshing feeds');
		$lastFeedRefresh = Date.now();
		const id = syncStore.add({
			title: 'Refreshing feeds',
		});
		// commenting this out temporarily
		// const res = await fetch('/rss/refresh.json');
		syncStore.remove(id);
		// await invalidate('/rss');
	});
	let pending_notification: string;

	$: if ($page.url.pathname === `/rss/${$page.params.id}/${$page.params.entry}`) {
		console.log('scrolling in!');
		tick().then(() => {
			$panes[2]?.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'start',
			});
		});
	}
</script>

<Header>
	<DefaultHeader>
		<div slot="start" class="flex items-center justify-between">
			<SmallPlus>{$page.data.currentList?.title || 'Feeds'}</SmallPlus>
		</div>
		<div slot="end" class="flex space-x-3">
			{#if $page.data['feed_list']}
				<Button
					variant="ghost"
					className="!px-1"
					tooltip={{
						text: 'Mark all as read',
					}}
					on:click={async () => {
						$page.data['feed_list'].items?.forEach((feed) => {
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
						text: 'Refresh feeds',
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
					// TODO: proper invalidation
					modals.open(UrlModal, {
						formAction: '/rss',
						placeholder: 'Enter RSS feed URL',
						name: 'url',
						pending: () => {
							modals.close();
							pending_notification = notifications.notify({
								message: 'adding feed...',
							});
						},
						done: async ({ response }) => {
							notifications.remove(pending_notification);
							// user_data_dirty.set(true);
							// await invalidate('/api/fetch_user_data?data=feeds');
							console.log(response.headers.get('Location'));
							goto(response.headers.get('Location')).then(() => {
								console.log('navigating done');
								notifications.notify({
									message: 'Feed added!',
									type: 'success',
								});
							});
							await userStore.updateData('feeds', {
								access_token: $page.data.lucia.access_token,
							});
						},
					});
				}}
				variant="ghost">Add Feed</Button
			>
		</div>
	</DefaultHeader>
</Header>

<div class="flex flex-col overflow-hidden">
	<!-- {feeds} -->
	<div class="flex h-full snap-x snap-mandatory grid-cols-3 overflow-auto lg:grid lg:grid-cols-12">
		<div bind:this={$panes[0]} class="min-w-full snap-start lg:col-span-3">
			<ul>
				<li
					class="flex h-10 flex-col justify-center truncate border-b border-gray-100 px-4 dark:border-gray-700 md:px-6"
				>
					<a
						on:click={async () => {
							await tick();
							$panes[1]?.scrollIntoView({
								behavior: 'smooth',
								block: 'nearest',
								inline: 'start',
							});
						}}
						href="/rss/entries">All</a
					>
				</li>
				<li
					class="flex h-10 flex-col justify-center truncate border-b border-gray-100 px-4 dark:border-gray-700 md:px-6"
				>
					<a
						on:click={async () => {
							await tick();
							$panes[1]?.scrollIntoView({
								behavior: 'smooth',
								block: 'nearest',
							});
						}}
						href="/rss/unread">Unread</a
					>
				</li>
				{#each feeds as feed (feed.id)}
					<li
						class="flex  h-10 flex-col justify-center border-b border-gray-100 px-4 dark:border-gray-700 md:px-6"
					>
						<a
							on:click={async () => {
								await tick();
								$panes[1]?.scrollIntoView({
									behavior: 'smooth',
									block: 'nearest',
								});
							}}
							class="truncate"
							href="/rss/{feed.id}">{feed.title}</a
						>
					</li>
				{/each}
			</ul>
		</div>
		<slot />
	</div>
</div>

<style>
	div {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	div::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera*/
	}
</style>
