<script lang="ts">
	import { invalidate } from '$app/navigation';
	import FavoriteStar from '$lib/components/FavoriteStar.svelte';

	import Icon from '$lib/components/helpers/Icon.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Saved from '$lib/components/Saved.svelte';
	import type { TagWithArticle } from '$lib/types';
	import { createFavorite, deleteFavorite } from '$lib/utils';

	export let tag: TagWithArticle;
	console.log({ tag });

	let starred = !!tag.favorite;
	let favorite_id: number | undefined = tag.favorite?.id;
</script>

<Header>
	<DefaultHeader>
		<div slot="start" class="flex items-center space-x-4">
			<h1 class="flex items-center space-x-3">
				<Icon name="tag" className="h-5 w-5 stroke-current stroke-2" /><span>{tag.name}</span>
			</h1>
			<!-- <button
				class="flex items-center"
				on:click={async () => {
					starred = !starred;
					// send to favorite store, and update
					if (starred) {
						const res = await createFavorite({
							tagId: tag.id
						});
						const { id } = await res.json();
						favorite_id = id;
					} else if (!starred) {
						if (favorite_id) {
							await deleteFavorite({ id: favorite_id });
							favorite_id = undefined;
						}
					}
					await invalidate('/favorites.json');
				}}
			>
				<Icon
					name="starSolid"
					className="h-4 w-4 {starred
						? 'fill-amber-400 stroke-1 stroke-amber-400'
						: 'stroke-1 stroke-current fill-transparent'}"
				/></button
			> -->
			<FavoriteStar
				{starred}
				{favorite_id}
				data={{
					tagId: tag.id
				}}
			/>
			<!-- TODO: Edit Menu (rename, delete) -->
		</div>
		<div slot="end">Edit View</div>
	</DefaultHeader>
</Header>

<div class="flex h-full flex-auto flex-col overflow-hidden">
	<!-- todo; overflow-auto and get scrolling to work only WITHIN this container... -->
	<div class="relative overflow-auto">
		<Saved articles={tag.articles} />
	</div>
</div>
<!-- <Saved articles={tag.articles} /> -->
