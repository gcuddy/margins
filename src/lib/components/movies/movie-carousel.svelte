<script lang="ts">
	export let movies: Array<{
		id: number;
		poster_path?: string;
		release_date: string;
		title: string;
	}>;
</script>

<div class="overflow-x-hidden">
	<div class="flex overflow-x-auto max-w-prose gap-2 py-4">
		{#each movies as movie (movie.id)}
			<a
				data-movie-thumbnail
				href="/tests/movie/{movie.id}"
				class="flex flex-col min-w-0 w-24 h-auto gap-2 object-cover shrink-0 rounded"
			>
				<img
					src="https://image.tmdb.org/t/p/w154/{movie.poster_path}"
					class="shrink-0 block rounded border shadow"
					alt="Poster for {movie.title}"
				/>
				<div class="min-w-0 flex flex-col">
					<span class="truncate text-sm font-semibold">{movie.title}</span>
					<span class="truncate text-xs text-muted-foreground"
						>{new Date(movie.release_date).getFullYear()}</span
					>
				</div>
			</a>
		{/each}
	</div>
</div>
