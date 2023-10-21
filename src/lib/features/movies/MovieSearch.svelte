<script lang="ts">
	import { page } from "$app/stores";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import SmallPlus from "$lib/components/atoms/SmallPlus.svelte";
	import GenericInput from "$lib/components/GenericInput.svelte";
	import dayjs from "$lib/dayjs";

	import { createQuery } from "@tanstack/svelte-query";
	import type { Movie } from "tmdb-ts";

	export let trending: Movie[] | undefined = undefined;

	let value = "";
	$: query = createQuery({
		queryKey: ["movies", "search", value],
		enabled: !!value,
		queryFn: async () => trpc($page).movies.public.search.query(value),
		staleTime: 60 * 1000 * 5,
		onSettled: (data) => console.log(data),
		keepPreviousData: true,
	});
</script>

<div>
	<GenericInput bind:value type="text" />
</div>

{#if $query.status === "loading" && $query.fetchStatus === "idle" && trending}
	Trending
	<ul>
		{#each trending as trending_movie}
			<li>{trending_movie.title}</li>
		{/each}
	</ul>
{/if}
{#if $query.isSuccess}
	<ul>
		{#each $query.data.results as result (result.id)}
			{@const type = result.media_type}
			<li class="flex gap-2 p-4">
				<div class=" h-auto w-20 shrink-0 overflow-hidden rounded-lg border border-gray-400 shadow">
					<!-- <img }" /> -->
					{#if result.poster_path}
						<img src="https://image.tmdb.org/t/p/w92/{result.poster_path}" />
					{:else}
						<div class=" flex h-[117px] flex-col items-center justify-center bg-gray-400">no poster</div>
					{/if}
				</div>
				<div class="flex flex-col gap-0.5">
					{#if type === "movie"}
						<a href="/movies/{result.id}" class="flex items-center gap-2">
							<span class="text-base font-medium">{result.title}</span>
							{#if result.release_date}
								<Muted class="text-sm">{dayjs(result.release_date).year()}</Muted>
							{/if}
						</a>
					{:else}
						<a href="/movies/tv{result.id}" class="flex items-center gap-2">
							<span class="text-base font-medium">{result.name}</span>
							{#if result.first_air_date}
								<Muted class="text-sm">{dayjs(result.first_air_date).year()}</Muted>
							{/if}
						</a>
					{/if}
					<Muted class="text-xs">{type === "movie" ? "Movie" : "TV Show"}</Muted>
					<span class="text-sm line-clamp-3">{result.overview}</span>
				</div>
			</li>
		{/each}
	</ul>
{:else if $query.isError}
	<p>Error</p>
{:else if $query.isLoading}
	<p>Loading...</p>
{/if}
