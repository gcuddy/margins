<script lang="ts" context="module">
	// export function getEntryId() {

	// }
</script>

<!-- @component
Takes in a URL and provides entry ID to its children, not rendering children until the entry ID is loaded.
-->
<script lang="ts">
	import {
		createMutation,
		useQueryClient,
	} from '@tanstack/svelte-query';
	import { getRPC } from './rpc-provider.svelte';
	import type { Article } from '@margins/parser';
	import { onMount } from 'svelte';
	import { parseArticle } from '@margins/parser/client';
	import { parser } from '../parser';

	let article: Article | null;
	const rpc = getRPC();
	const queryClient = useQueryClient();
	let entryID: string | null = null;

	interface $$Slots {
		default: {
			entryID: string;
		};
	}

	// setContext('entryID', entryID);

	// createQuery({
	//     queryKey: ["entry", article.url],
	//     queryFn: () => rpc.query("entry_fromUrl", { url: article.url }),
	// })

	async function getArticle() {
		const metadata = await chrome.runtime.sendMessage({
			action: 'getMetadata',
		});
		const article = await parseArticle(parser, metadata);
		return article;
	}

	const createEntryMutation = createMutation({
		mutationFn: (article: Article) => rpc.mutate('entry_create', article),
		onError: (error) => {
			console.error('createEntryMutation', { error });
		},
		onSuccess: (data) => {
			console.log('createEntryMutation', { data });
			if (data) entryID = data?.id;
		},
	});

	onMount(async () => {
		if (!article) {
			article = await getArticle();
			$createEntryMutation.mutate(article);
		}
	});
</script>

{#if !entryID}
	<p>Loading...</p>
{:else}
	<slot {entryID} />
{/if}
