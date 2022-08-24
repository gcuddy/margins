<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Button from '$lib/components/Button.svelte';
	import { modals } from '$lib/stores/modals';
	import UrlModal from '$lib/components/modals/URLModal.svelte';
	import Form from '$lib/components/Form.svelte';
	import { page } from '$app/stores';
	import { syncStore } from '$lib/stores/sync';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import { lastFeedRefresh } from '$lib/stores/feeds';
	import { onMount } from 'svelte';

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
			title: 'Refreshing feeds'
		});
		const res = await fetch('/rss/refresh.json');
		syncStore.remove(id);
		// await invalidate('/rss');
		console.log({ res });
	});
</script>

<div class="flex flex-col overflow-hidden">
	<Header>
		<DefaultHeader>
			<div slot="start">
				<SmallPlus>{$page.data.currentSubscriptionTitle || 'Feeds'}</SmallPlus>
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
	<slot />
</div>
