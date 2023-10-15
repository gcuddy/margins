<script lang="ts">
	import { page } from '$app/stores';
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';
	import { qquery } from '$lib/queries/query';
	import { createQuery } from '@tanstack/svelte-query';
	import { findClosestImage } from '$lib/utils';
	import { queryFactory } from '$lib/queries/querykeys';
	import { derived } from 'svelte/store';
	import type { Status } from '$lib/status';
	import StatusIcon from '$components/entries/StatusIcon.svelte';

	export let spotifyArtistId: string;

	/**
	 * Album ids to filter out from the list
	 */
	export let filterOutIds: string[] = [];

	const query = createQuery({
		queryFn: () => qquery($page, 'artistAlbums', { id: spotifyArtistId }),
		queryKey: ['artistAlbums', spotifyArtistId],
	});

	const allEntriesQuery = createQuery(queryFactory.entries.all());

	const libraryLookup = derived(
		[query, allEntriesQuery],
		([$query, $allEntriesQuery]) => {
			if (!$query.data || !$allEntriesQuery.data)
				return {} as Record<string, Status | null>;
			return Object.fromEntries(
				$query.data.items.map((i) => {
                    const entry = $allEntriesQuery.data.find((e) => e.spotifyId === i.id);
                    console.log({entry, i, $allEntriesQuery});
					return [
						i.id,
						entry?.bookmarked_at ? entry.status : null,
					];
				}),
			);
		},
	);

    $: console.log({$libraryLookup})

	export let as = 'li';
</script>

{#if $query.data}
	{#each $query.data.items.filter((i) => {
		return !filterOutIds.includes(i.id);
	}) as album}
		{@const image = findClosestImage(album.images, 48)}
		<svelte:element this={as}>
			<a href="/album/{album.id}" class="flex gap-2">
				{#if image}
					<img
						style="view-transition-name:album-artwork-{album.id}"
						src={image.url}
						alt="Album artwork for {album.name}"
						class="w-12 h-12 shadow rounded"
					/>
				{/if}
				<div class="flex flex-col justify-around">
					<div class="flex items-center">
                        <span class="font-medium line-clamp-1">{album.name}</span>
						{#if $libraryLookup[album.id]}
							<span class="text-xs text-muted-foreground">
                                <StatusIcon status={$libraryLookup[album.id]} class="h-3 w-3 ml-1 text-muted-foreground" />
                            </span>
						{/if}
					</div>
					<span class="text-muted-foreground text-xs"
						>{album.artists[0]?.name}</span
					>
				</div>
			</a>
		</svelte:element>
	{/each}
{:else if $query.isLoading}
	{#each [1, 2, 3, 4, 5] as i}
		<div class="flex gap-2">
			<Skeleton class="w-12 h-12 shadow" />
			<div class="flex flex-col justify-around grow">
				<Skeleton class="w-3/4 h-4" />
				<Skeleton class="w-1/2 h-3" />
			</div>
		</div>
	{/each}
{/if}
