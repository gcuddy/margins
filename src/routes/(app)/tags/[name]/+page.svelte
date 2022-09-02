<script lang="ts">
	import { invalidate } from '$app/navigation';
	import CustomizeView from '$lib/components/CustomizeView.svelte';
	import FavoriteStar from '$lib/components/FavoriteStar.svelte';

	import Icon from '$lib/components/helpers/Icon.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Saved from '$lib/components/Saved.svelte';
	import { notifications } from '$lib/stores/notifications';
	import { syncStore } from '$lib/stores/sync';
	import { ViewOptionsSchema, type ViewOptions } from '$lib/types/schemas/View';
	import { createFavorite, deleteFavorite, sortArticles } from '$lib/utils';
	import type { PageData } from '../../../../../.svelte-kit/types/src/routes/tags/[name]/$types';

	export let data: PageData;
	let { tag } = data;
	console.log({ tag });

	let starred = !!tag.favorite;
	let favorite_id: number | undefined = tag.favorite?.id;
	let viewOptions: ViewOptions | undefined;
	$: if (viewOptions) tag.articles = sortArticles(tag.articles, viewOptions);
	const savedViewOptions = ViewOptionsSchema.safeParse(tag.viewOptions);
	if (savedViewOptions.success) {
		viewOptions = savedViewOptions.data;
	}
</script>

<Header>
	<DefaultHeader>
		<div slot="start" class="flex items-center space-x-4">
			<h1 class="flex items-center space-x-3">
				<Icon name="tag" className="h-5 w-5 stroke-current stroke-2" /><span>{tag.name}</span>
			</h1>
			<FavoriteStar
				{starred}
				{favorite_id}
				data={{
					tagId: tag.id,
				}}
			/>
			<!-- TODO: Edit Menu (rename, delete) -->
		</div>
		<div slot="end">
			<CustomizeView
				bind:viewOptions
				on:save={async () => {
					const syncId = syncStore.add();
					const res = await fetch(`/tags/${tag.name}`, {
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
					} else {
						syncStore.remove(syncId);
						notifications.notify({
							title: 'Failed to save view options',
							message: res.statusText,
							type: 'error',
						});
					}
				}}
			/>
		</div>
	</DefaultHeader>
</Header>

<div class="flex h-full flex-auto flex-col overflow-hidden">
	<!-- todo; overflow-auto and get scrolling to work only WITHIN this container... -->
	<div class="relative overflow-auto">
		<Saved articles={tag.articles} {viewOptions} />
	</div>
</div>
<!-- <Saved articles={tag.articles} /> -->
