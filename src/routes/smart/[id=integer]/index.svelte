<script lang="ts">
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import CustomizeView from '$lib/components/CustomizeView.svelte';
	import FavoriteStar from '$lib/components/FavoriteStar.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';

	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Saved from '$lib/components/Saved.svelte';
	import type { ComponentProperties } from '$lib/stores/types';
	import type { ArticleWithNotesAndTagsAndContext, SmartListWithPayload } from '$lib/types';
	import type { ViewOptions } from '$lib/types/schemas/View';
	import { sortArticles } from '$lib/utils';
	import type { Article } from '@prisma/client';

	export let articles: ArticleWithNotesAndTagsAndContext[] = [];
	export let list: SmartListWithPayload;

	let viewOptions: ViewOptions | undefined;
	let sortedArticles: ArticleWithNotesAndTagsAndContext[] = articles;
	$: if (viewOptions) sortedArticles = sortArticles(articles, viewOptions);
	$: console.log({ sortedArticles });
</script>

<Header>
	<DefaultHeader>
		<div slot="start" class="flex items-center space-x-2">
			<Icon name="collectionSolid" />
			<SmallPlus size="base">{list.name}</SmallPlus>
			<FavoriteStar
				starred={!!list.favorite}
				data={{
					smartListId: list.id
				}}
			/>
		</div>
		<div slot="end">
			<CustomizeView bind:viewOptions />
		</div>
	</DefaultHeader>
</Header>
{#if articles.length}
	<Saved
		articles={sortedArticles || articles}
		actions={{
			addToList: true
		}}
		viewOptions={viewOptions?.properties}
	/>
{/if}
<!-- TODO: make work progressively enhanced with actual forms -->

<!-- <div class="flex max-w-md flex-col ">
	<span>
		If
		<Select block={false} bind:value={and}>
			<option value="AND">Any</option>
			<option value="OR">All</option>
			<option value="NOT">None</option>
		</Select>
		of the following conditions are met
	</span>
	<Button on:click={newCondition} variant="ghost">New Condition</Button>
	{#each conditions as condition, index (condition.id)}
		<label for="condition-{index}" class="flex items-center">
			<Select bind:value={condition.field}>
				<option value="author">Author</option>
				<option value="title">Title</option>
				<option value="url">URL</option>
			</Select>
		</label>
		<Select name="{condition.field}-filter" bind:value={condition.filter}>
			<option value="contains">Contains</option>
			<option value="equals">Is</option>
		</Select>
		<GenericInput id="condition-{index}" name={condition.field} bind:value={condition.value} />
	{/each}

	<pre>
    {JSON.stringify(json, null, 2)}
  </pre>
	{#if current_results.length}
		<Saved articles={current_results} />
	{/if}
</div> -->
