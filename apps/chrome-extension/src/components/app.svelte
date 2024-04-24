<script lang="ts">
	export let userID: string;
	import { Button } from '@margins/ui';
	import type { ServerMutations } from '@margins/features/replicache/server';
	import RssButton from './rss-button.svelte';
	import Inspector from './inspector-button.svelte';
	import { state } from '../state';
	import SaveButton from './save-button.svelte';
	import { parser } from '../parser';
	import { FeedInput } from '@margins/features/rss';
	import { createMutation } from '@tanstack/svelte-query';
	import { getRPC } from './rpc-provider.svelte';

	const API_URL = `http://127.0.0.1:1999/parties/main/${userID}`;

	const rpc = getRPC();

	type SubscriptionArgs = ServerMutations['subscription_create']['input'];
	const createSubscriptionMutation = createMutation({
		mutationFn: (args: SubscriptionArgs) =>
			rpc.mutate('subscription_create', args),
	});

	async function handleAnnotation() {
		const tab = await chrome.tabs.query({
			active: true,
			currentWindow: true,
		});
		const tabId = tab[0].id;
		if (!tabId) return;
		chrome.tabs.sendMessage(tabId, { action: 'showAnnotate' });
	}
</script>

{#if $state.page === null}
	<!-- <Button
		on:click={async () => {
			saving = true;
			await save();
			await sendToApi();
			saving = false;
		}}
		>Save
		{#if saving}
			<Spinner size="24" />
		{/if}
	</Button> -->

	<SaveButton {parser} />

	<Button on:click={handleAnnotation}>Annotate</Button>

	<RssButton {parser} />

	<!-- TODO: remove this lol -->
	<Inspector />
{:else if $state.page === 'rss'}
	<FeedInput
		onSubmit={(feeds) => {
			feeds.map((feed) => {
				$createSubscriptionMutation.mutate({
					title: feed.name ?? feed.url,
					url: feed.url,
				});
			});
		}}
		feeds={$state.feeds}
	/>
{/if}
