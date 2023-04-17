<script>
	import AspectRatio from "$lib/components/ui/AspectRatio.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { H1, Lead, Subtle } from "$lib/components/ui/typography";
	export let data;

	$: director = data.movie.credits?.crew
		.filter((c) => c.job === "Director")
		.map((c) => c.name)
		.join(", ");
</script>

<div class="flex select-text flex-col gap-4">
	<div class="flex items-center gap-6">
		<img
			src="https://image.tmdb.org/t/p/w500/{data.movie.poster_path}"
			alt=""
			class="aspect-auto rounded-md sm:w-[150px] md:w-[200px]"
		/>
		<div class="flex flex-col gap-2">
			<Subtle>Movie</Subtle>
			<H1>{data.movie.title}</H1>
			<Lead>
				{director} — {new Date(data.movie.release_date).getFullYear()}
			</Lead>
			<Button class="mt-auto">Bookmark</Button>
		</div>
	</div>

	<div class="prose prose-slate dark:prose-invert">
		{@html data.movie.overview}
	</div>
</div>
