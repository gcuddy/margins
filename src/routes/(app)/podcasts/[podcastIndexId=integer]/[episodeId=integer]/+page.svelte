<script lang="ts">
	import Episode from "$lib/features/podcasts/Episode.svelte";
	import { useCurrentPodcast } from "../+layout.svelte";
	import type { PageData } from "./$types";
	export let data: PageData;

   const currentPodcast = useCurrentPodcast();
</script>

<div class="container mx-auto flex flex-col space-y-8 divide-y p-6 dark:divide-gray-700">
	<Episode bind:feedTitle={$currentPodcast.podcast} bind:title={$currentPodcast.episode} episodeId={data.episodeId} />
</div>
