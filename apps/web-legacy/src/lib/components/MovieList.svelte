<script lang="ts">
	import type { Movie } from "tmdb-ts";
	import ItemArtwork from "./ItemArtwork.svelte";
	export let movies: (Movie & {
		credits?: {
			crew: {
				job: string;
				name: string;
			}[];
		};
	})[];
</script>

<div
	class="grid grid-cols-2 gap-x-1 gap-y-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
>
	{#each movies as movie}
		<ItemArtwork
			item={{
				id: movie.id,
				title: movie.title,
				type: "movie",
				image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
				author: movie.credits?.crew.find((c) => c.job === "Director")?.name,
				date: new Date(movie.release_date).getFullYear().toString(),
			}}
			class="w-[150px]"
		/>
	{/each}
</div>
