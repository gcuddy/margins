<script lang="ts">
	import Dot from '$lib/components/atoms/Dot.svelte';
	import Muted from '$lib/components/atoms/Muted.svelte';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import { podcastPlayer } from '$lib/components/PodcastPlayer.svelte';
	import { formatDate, formatDuration } from '$lib/utils/dates';
	import type { PageData } from './$types';
	export let data: PageData;

	$: episode = { ...data };
	function play() {
		podcastPlayer.load(episode, {
			...data.RssFeed,
			url: data.RssFeed.feedUrl,
			image: data.RssFeed.imageUrl,
		});
	}
</script>

<!-- page idea taken from rssitem, i sohuld turn into component -->
<div
	class=" flex flex-col overflow-y-auto ring-gray-500/50 dark:ring-gray-700/50 lg:m-3 lg:rounded-md lg:shadow-2xl lg:ring-1"
>
	<!-- fix having to do this padding by instead using a different layout -->
	<div
		class="flex items-center justify-between border-b p-2 pl-12 dark:border-gray-700 dark:bg-gray-800 lg:pl-2"
	>
		<div class="flex items-center space-x-2">
			<a href="/rss/podcasts/{data.rssFeedId}">
				<Icon name="xSolid" className="h-4 w-4 fill-current" />
			</a>
		</div>
	</div>

	<div class="container mx-auto flex flex-col space-y-8 divide-y p-6 dark:divide-gray-700">
		<div
			class="relative flex flex-col items-center space-y-8 sm:flex-row sm:space-y-0 sm:space-x-12"
		>
			<!-- <img
				src={image}
				class="absolute h-full w-full opacity-25 blur-3xl"
				alt="Artwork for {title}"
			/> -->
			<img
				src={data.RssFeed.imageUrl}
				class="h-60 w-60 place-self-center rounded-xl shadow-lg sm:place-self-end"
				alt="Artwork for {data.RssFeed.title}"
			/>
			<div class="space-y-4 sm:space-y-8">
				<div class="flex flex-col space-y-2 text-center sm:text-left">
					<div class="flex space-x-2 text-xs uppercase tracking-tight">
						<Muted>{formatDate(data.pubDate)}</Muted>
						<Dot />
						<Muted>{formatDuration(data.duration, 'seconds')}</Muted>
					</div>
					<h1 class="text-2xl font-bold line-clamp-3">{data.title}</h1>
					<a class="text-xl" href="/rss/{data.rssFeedId}">{data.RssFeed.title}</a>
				</div>
				<Button className="flex items-center space-x-2 text-lg py-4 px-3 mt-auto" on:click={play}>
					<Icon name="playSolid" />
					<span>Play</span></Button
				>
			</div>
		</div>
		<div class="prose prose-stone max-w-prose pt-4 leading-normal dark:prose-invert">
			{@html data.description}
		</div>
	</div>
</div>
