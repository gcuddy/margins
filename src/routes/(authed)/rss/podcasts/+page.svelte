<script lang="ts">
	import Muted from '$lib/components/atoms/Muted.svelte';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import { podcastPlayer } from '$lib/components/PodcastPlayer.svelte';
	import type { PageData } from '../../../../../.svelte-kit/types/src/routes/rss/podcasts/$types';
	export let data: PageData;
</script>

<Header>
	<DefaultHeader>
		<div slot="start">
			<SmallPlus>Podcasts</SmallPlus>
		</div>
		<div slot="end">
			<a href="/rss/podcasts/add">Add Podcasts</a>
		</div>
	</DefaultHeader>
</Header>

<ul class="flex flex-col divide-y overflow-auto px-4 dark:divide-gray-700">
	{#each data.podcasts as podcast}
		<li class="py-2" tabindex="-1">
			<a
				class="flex h-16 items-center space-x-6 rounded p-2 dark:focus-visible:bg-gray-800 dark:active:bg-gray-800"
				href="/rss/podcasts/{podcast['itunes_id']}"
				data-sveltekit-prefetch
			>
				<img class="h-16 w-16 rounded-lg" src={podcast.imageUrl} />
				<div class="flex flex-auto flex-col">
					<h2 class="font-medium line-clamp-2">{podcast.title}</h2>
					{#if podcast.creator}
						<Muted>{podcast.creator}</Muted>
					{/if}
				</div>
			</a>
		</li>
	{/each}
</ul>
