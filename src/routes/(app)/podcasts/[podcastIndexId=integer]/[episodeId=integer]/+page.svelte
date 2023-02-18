<script lang="ts">
	import { page } from "$app/stores";
	import Episode from "$lib/features/podcasts/Episode.svelte";
	import { createQuery } from "@tanstack/svelte-query";
	import { podcastEpisodeQuery } from "$lib/features/podcasts/queries";
	import type { PageData } from "./$types";
	export let data: PageData;

	// const episode = createQuery({
	//     queryKey: ["podcasts", "episodes", data.episodeId],
	//     queryFn:
	// })

	// const query = createQuery({
	// 	...podcastEpisodeQuery($page, data.episodeId),
	// 	// placeholderData: {
	// 	// 	episode: data.placeholderData,
	// 	// 	entry: undefined,
	// 	// },
	// });

	// $: console.log({ $query, data });
</script>

<div class="container mx-auto flex flex-col space-y-8 divide-y p-6 dark:divide-gray-700">
	<Episode episodeId={data.episodeId} />
</div>
