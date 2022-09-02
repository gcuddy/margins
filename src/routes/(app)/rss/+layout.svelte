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
	import Icon from '$lib/components/helpers/Icon.svelte';
	import { currentFeedList } from './+page.svelte';
	import type { LayoutData } from './$types';
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
</script>

<div class="flex flex-col overflow-hidden">
	<!-- {feeds} -->
	<slot />
</div>
