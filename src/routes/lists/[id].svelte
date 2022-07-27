<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { commandPaletteStore } from '$lib/components/CommandPalette/store';
	import { getArticles } from '$lib/data/sync';
	import Saved from '$lib/components/Saved.svelte';
	import { cachedArticlesStore } from '$lib/stores/cache';
	import type { ListWithItems } from '$lib/types';
	import { patch, put } from '$lib/utils';
	import type { Article } from '@prisma/client';
	import { derived } from 'svelte/store';
	export let list: ListWithItems;
	$: articles = list.items?.flatMap((i) => i.article)?.filter((i) => i) as Article[];
	const availableArticlesToAdd = derived(cachedArticlesStore, ($articles) => {
		const existingIds = articles?.map((a) => a.id) ?? [];
		return $articles?.articles?.filter((a) => !existingIds.includes(a.id)) || [];
	});
</script>

<!-- <pre>
  {JSON.stringify(list, null, 2)}
</pre> -->

<h1>{list.name}</h1>
<Button
	on:click={async () => {
		// set off getArticles to update cache
		getArticles();
		console.log("getting articles, here's what's cached so far", { $availableArticlesToAdd });
		commandPaletteStore.open({
			// TO fix: will fix type when commandPalette types get fixed
			values: availableArticlesToAdd,
			onSelect: async ({ detail }) => {
				console.log({ detail });
				// optimistic update
				list.items = [...list.items, { article: detail }];
				const res = await put(`/lists/${list.id}`, {
					articleId: detail.id
				});
				console.log({ res });
			}
		});
	}}>Add Items</Button
>
<!-- todo: star -->

<!-- TODO: "Feed" of Articles, Bookmarks, Annotations (maybe?) -->
<Saved {articles} />

<!-- {#each list.items as item}
	{item.title}
{/each} -->
