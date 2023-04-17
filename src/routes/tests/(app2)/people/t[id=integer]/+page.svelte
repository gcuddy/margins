<script>
	import MovieList from "$lib/components/MovieList.svelte";
	import { H1, H2 } from "$lib/components/ui/typography";

	export let data;
</script>

<H1>{data.person.name}</H1>

<div class="mt-20 space-y-4">
	<H2>Movies Directed</H2>

	<MovieList
		movies={data.person.combined_credits.crew?.filter(
			(c) => c.job === "Director"
		) ?? []}
	/>
</div>
