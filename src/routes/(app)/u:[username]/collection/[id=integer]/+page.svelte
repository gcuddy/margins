<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { commandPaletteStore } from '$lib/components/CommandPalette/store';
	import { getArticles } from '$lib/data/sync';
	import Saved from '$lib/components/Saved.svelte';
	import { cachedArticlesStore } from '$lib/stores/cache';
	import type { ArticleInList } from '$lib/types';
	import { put } from '$lib/utils';
	import { derived } from 'svelte/store';

	import type { PageData } from './$types';

	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	export let data: PageData;
	console.log({ data });
	$: list = data.list;
	$: articles = list.items?.flatMap((i) => i.article)?.filter((i) => i) as ArticleInList[];
	const availableArticlesToAdd = derived(cachedArticlesStore, ($articles) => {
		const existingIds = articles?.map((a) => a.id) ?? [];
		return $articles?.articles?.filter((a) => !existingIds.includes(a.id)) || [];
	});
</script>

<!-- <pre>
  {JSON.stringify(list, null, 2)}
</pre> -->

<Header>
	<DefaultHeader>
		<div slot="start" class="flex items-center space-x-2">
			<Icon name="viewGrid" className="h-5 w-5 stroke-2 dark:stroke-gray-400" />
			<SmallPlus>{list.name}</SmallPlus>
		</div>
	</DefaultHeader>
</Header>

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
				const newItem = {
					article: detail,
					id: Math.random().toString(36).substr(2, 9),
				};
				// ignore this for now till i figure out how to type this
				list.items = [...list.items, newItem];
				const res = await put(`/lists/${list.id}`, {
					articleId: detail.id,
				});
				console.log({ res });
			},
		});
	}}>Add Items</Button
>
<!-- todo: star -->

<!-- TODO: "Feed" of Articles, Bookmarks, Annotations (maybe?) -->
<Saved {annotations} />

<!-- {#each list.items as item}
	{item.title}
{/each} -->
