<script lang="ts">
	import { page } from "$app/stores";

	//

	import MovieSearch from "$lib/features/movies/MovieSearch.svelte";
	import { trpc } from "$lib/trpc/client";
	import { createQuery } from "@tanstack/svelte-query";

	const trending = createQuery({
		queryKey: ["movies", "trending"],
		queryFn: async () => trpc($page).movies.public.trending.query(),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
	});
</script>

<h1>Movies</h1>

<MovieSearch trending={$trending.data?.results} />
