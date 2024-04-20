<script lang="ts">
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { getCurrentMetadata } from '../utils';
	import { onMount } from 'svelte';
	import { getRPC } from './rpc-provider.svelte';
	import { Button } from '@margins/ui';
	import type { Parser } from '@margins/parser';
	import { parseArticle } from '@margins/parser/client';
	export let parser: Parser;
	let url: string | null = null;

	const rpc = getRPC();
	let saving = false;
	let saved = false;

	const queryClient = useQueryClient();

	$: bookmarkQuery = createQuery({
		enabled: !!url,
		queryFn: () => rpc.query('bookmark_fromUrl', { uri: url! }),
		queryKey: ['bookmark', url],
	});

	async function save() {
		await getCurrentMetadata(async (response) => {
			const html = response.html;
			const url = response.url;
			const { url: _, ...article } = await parseArticle(parser, {
				html,
				url: url ?? '',
			});
			const res = await rpc.mutate('bookmark_create', {
				entry: article,
				status: 'Backlog',
				uri: url,
			});
			if (res) {
				queryClient.setQueryData(['bookmark', url], res);
			} else {
				queryClient.invalidateQueries({ queryKey: ['bookmark'] });
			}
		});
		const screenshot = await chrome.tabs.captureVisibleTab();
		console.log({ save });
	}

	onMount(() => {
		getCurrentMetadata((data) => {
			console.log({ data });
			url = data.url;
		});
	});
</script>

<Button
	disabled={!url || saving || saved || !!$bookmarkQuery.data}
	on:click={async () => {
		saving = true;
		await save();
		saving = false;
	}}
	>{$bookmarkQuery.data ? 'Saved' : 'Save'}
</Button>
