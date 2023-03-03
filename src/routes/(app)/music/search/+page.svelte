<script lang="ts">
	import { page } from "$app/stores";
	import EntryListItem from "$lib/features/entries/EntryListItem.svelte";
	import { trpc } from "$lib/trpc/client";
	import { createQuery } from "@tanstack/svelte-query";

	let value = "";

	$: query = createQuery({
		queryKey: ["music", "search", value],
		enabled: !!value,
		// TODO: debounce
		queryFn: async () => trpc().music.public.search.query(value),
		staleTime: 60 * 1000 * 5,
		keepPreviousData: true,
		select: (data) => data.body?.albums?.items,
		onSettled: (data) => console.log(data),
	});
</script>

<input type="text" bind:value />

{#if $query.isInitialLoading}
	Loading...
{:else if $query.isError}
	Error
{:else if $query.isSuccess}
	{#each $query.data || [] as album}
		<EntryListItem
            href={`/music/${album.id}`}
			entry={{
				image: album.images[0].url,
				title: album.name,
				author: album.artists[0].name,
				published: album.release_date,
			}}
		/>
	{/each}
{/if}
