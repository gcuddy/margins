<script lang="ts">
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import CustomizeView from '$lib/components/CustomizeView.svelte';
	import FavoriteStar from '$lib/components/FavoriteStar.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';

	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Saved from '$lib/components/Saved.svelte';
	import { notifications } from '$lib/stores/notifications';
	import { syncStore } from '$lib/stores/sync';
	import { ViewOptionsSchema, type ViewOptions } from '$lib/types/schemas/View';
	import { sortArticles } from '$lib/utils';
	import type { PageData } from '../../../../../.svelte-kit/types/src/routes/smart/[id=integer]/$types';

	export let data: PageData;
	let { list, articles } = data;
	let viewOptions: ViewOptions | undefined;
	if (list) {
		const savedViewOptions = ViewOptionsSchema.safeParse(list.viewOptions);
		if (savedViewOptions.success) {
			viewOptions = savedViewOptions.data;
		}
	}
	let sortedArticles = [...articles];
	$: if (viewOptions) sortedArticles = sortArticles(articles, viewOptions);
	$: console.log({ sortedArticles });
</script>

<svelte:head>
	<title>{list.name}</title>
</svelte:head>

<Header>
	<DefaultHeader>
		<div slot="start" class="flex items-center space-x-2">
			<Icon name="collectionSolid" />
			<SmallPlus size="base">{list.name}</SmallPlus>
			<FavoriteStar
				starred={!!list.favorite}
				data={{
					smartListId: list.id,
				}}
			/>
		</div>
		<div slot="end">
			<CustomizeView
				bind:viewOptions
				on:save={async () => {
					const syncId = syncStore.add();
					const res = await fetch(`/smart/${list.id}`, {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							viewOptions,
						}),
					});
					if (res.ok) {
						syncStore.remove(syncId);
						notifications.notify({
							message: 'View options saved',
							type: 'success',
						});
					}
				}}
			/>
		</div>
	</DefaultHeader>
</Header>
{#if articles.length}
	<Saved
		annotations={sortedArticles || articles}
		actions={{
			addToList: true,
		}}
		{viewOptions}
	/>
{:else}{/if}
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
