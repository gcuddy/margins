<script lang="ts">
	import { page } from "$app/stores";
	import Button from "$lib/components/Button.svelte";
	import MediaItem from "$lib/components/layout/MediaItem.svelte";
	import { trpc } from "$lib/trpc/client";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { createQuery, useQueryClient } from "@tanstack/svelte-query";
	import type { PageData } from "./$types";
	export let data: PageData;
	const queryClient = useQueryClient();
	$: queries = queryClient
		.getQueriesData<RouterOutputs["music"]["public"]["search"]>(["music", "search"])
		.flatMap((q) => q[1]?.body?.albums?.items || []);
	$: existingAlbum = queries.find((q) => q.id === data.id);
	$: ({ id } = data);
	$: query = createQuery({
		queryKey: ["music", "album", id],
		queryFn: async () => trpc($page).music.public.album.query(id),
		staleTime: 60 * 1000 * 5,
		keepPreviousData: true,
		onSettled: (data) => console.log(data),
		// select: data => data?.body
		// placeholderData: () => {
		// 	const searchedAlbums = queryClient
		// 		.getQueriesData<RouterOutputs["music"]["public"]["search"]>(["music", "search"])
		// 		.flatMap((q) => q[1]?.body?.albums?.items || []);
		// 	const existingAlbum = searchedAlbums.find((q) => q.id === data.id);
		// 	return existingAlbum as any;
		// },
		// initialData: () => {
		//     const queries = queryClient.getQueriesData(["music", "search"])
		//     console.log({queries})
		// }
	});
</script>

<!-- {JSON.stringify($query.data, null, 2)} -->
<MediaItem
	error={$query.isError}
	success={$query.isSuccess}
	loading={$query.isLoading}
	img={$query.data?.body.images?.[0]?.url}
	title={$query?.data?.body.name}
	description={$query?.data?.body.genres.join(", ")}
	author={$query.data?.body.artists.map(a => a.name).join(", ")}
>
<svelte:fragment slot="meta">
	<span class="text-muted/70 text-sm"
		>{#if $query.isSuccess}
			{new Date($query.data?.body.release_date).getFullYear()}
		{/if}</span
	>
	<span class="text-muted/70 text-sm"
		>
        {#if $query.isSuccess}
            {$query.data.body.label}
        {/if}
        </span
	>
</svelte:fragment>
<Button className="mt-auto w-auto inline-flex" slot="actions">
    Save
</Button>
<div slot="content">
    <!--spotify embed  -->
    <iframe style="border-radius:12px" src="https://open.spotify.com/embed/album/{data.id}?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    <!-- <iframe
        src={`https://open.spotify.com/embed/album/${data.id}`}
        width="100%"
        height="352"
        frameborder="0"
        allowtransparency={true}
        allow="encrypted-media" /> -->
    {#each $query.data?.body.tracks.items || [] as track}
        <div class="flex items-center">
            <div class="flex-1">
                {track.name}
            </div>
            <div class="flex-1">
                {track.duration_ms}
            </div>
            <!-- spotify track embed -->

            <!-- {#if track.preview_url}
                <audio controls src={track.preview_url} />
            {/if} -->
        </div>
    {/each}
</div>
</MediaItem>
