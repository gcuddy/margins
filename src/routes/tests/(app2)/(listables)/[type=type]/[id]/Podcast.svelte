<script lang="ts">
	import { page } from '$app/stores';
	import smoothload from '$lib/actions/smoothload';
	import { audioPlayer } from '$lib/components/AudioPlayer.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/Button.svelte';
	import { Dialog, DialogContent } from '$lib/components/ui/dialog';
	import DialogTrigger from '$lib/components/ui/dialog/DialogTrigger.svelte';
	import { H1, Lead, Muted } from '$lib/components/ui/typography';
	import { isUpcoming } from '$lib/utils/date';

	import type { PageData } from './$types';
	import BookmarkForm from './BookmarkForm.svelte';
	import EntryOperations from './EntryOperations.svelte';
	type Podcast = PageData['podcast'];
	export let data: PageData & {
		podcast: NonNullable<Podcast>;
	};

	$: console.log({ data });

	$: podcast = data.podcast;
	$: episode = podcast?.episode;

	$: loaded = $audioPlayer.audio?.src === episode?.enclosureUrl;
</script>

{#if data.podcast?.episode}
	<div class="flex select-text flex-col gap-4">
		<div class="flex gap-6 max-sm:flex-col sm:items-center">
			<img
				src={data.podcast.episode.image || data.podcast.episode.feedImage}
				alt=""
				class="aspect-auto rounded-md shadow-lg sm:w-[150px] md:w-[200px]"
				use:smoothload
			/>
			<div class="flex flex-col gap-2">
				<Muted>Podcast</Muted>
				<H1>{episode.title}</H1>
				<Lead>
					<a href="/tests/show/p{episode.feedId}">{episode.feedTitle}</a>
					<!-- {#if director}
					<a href="/tests/people/t{director.id}">{director.name}</a>{/if} — {new Date(
					data.movie.release_date
				).getFullYear()} -->
				</Lead>
				<div class="flex space-x-4">
					<Button
						on:click={() => {
							if (loaded) {
								audioPlayer.toggle();
								return;
							}
							audioPlayer.load({
								src: episode.enclosureUrl,
								title: episode.title,
								artist: episode.feedTitle,
								image: episode.feedImage,
								entry_id: data.entry?.id,
								interaction_id: data.entry?.interaction?.id,
								slug: $page.url.pathname,
							}, data.entry?.interaction?.progress);
						}}>
						{#if !loaded || (loaded && $audioPlayer.state.paused)}
							Play
						{:else}
								Pause
						{/if}
						</Button
					>
					<div class="flex items-center gap-2">
						<BookmarkForm data={data.bookmarkForm} />
						{#if data.entry}
							<EntryOperations data={data.annotationForm} entry={data.entry} />
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="prose prose-slate space-y-4 dark:prose-invert">
			<div>
				{@html data.podcast.episode.description}
			</div>
		</div>
	</div>
{/if}
