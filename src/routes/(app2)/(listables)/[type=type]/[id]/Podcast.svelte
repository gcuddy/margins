<script lang="ts">
	import { page } from '$app/stores';
	import AddInlineAnnotation from '$components/annotations/add-inline-annotation.svelte';
	import SaveToLibraryButton from '$components/entries/save-to-library-button.svelte';
	import Editor from '$components/ui/editor/Editor.svelte';
	import LibraryForm from '$components/ui/library/library-form.svelte';
	import smoothload from '$lib/actions/smoothload';
	import { audioPlayer } from '$lib/components/AudioPlayer.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Dialog, DialogContent } from '$lib/components/ui/dialog';
	import { H1, Lead, Muted } from '$lib/components/ui/typography';
	import { isUpcoming } from '$lib/utils/date';
	import { isMediaType, makeMediaSchema } from '$lib/utils/entries';

	import type { PageData } from './$types';
	import BookmarkForm from './BookmarkForm.svelte';
	import EntryOperations from './EntryOperations.svelte';

	type Podcast = PageData['podcast'];
	export let data: PageData & {
		podcast: NonNullable<Podcast>;
	};

	import { Play, Pause, Pencil2, Stop } from 'radix-icons-svelte';

	let noting = false;

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
				<h1 class="font-bold text-3xl md:text-4xl">{episode.title}</h1>
				<Lead>
					<a href="/show/p{episode.feedId}">{episode.feedTitle}</a>
					<!-- {#if director}
					<a href="/people/t{director.id}">{director.name}</a>{/if} — {new Date(
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
							audioPlayer.load(
								{
									src: episode.enclosureUrl,
									title: episode.title,
									artist: episode.feedTitle,
									image:
										data.podcast.episode.image ||
										data.podcast.episode.feedImage,
									entry_id: data.entry?.id,
									interaction_id: data.entry?.interaction?.id,
									slug: $page.url.pathname,
								},
								data.entry?.interaction?.progress,
							);
						}}
					>
						{@const play = !loaded || (loaded && $audioPlayer.state.paused)}
						<svelte:component this={play ? Play : Pause} class="h-4 w-4 mr-2" />
						{#if play}
							Play
						{:else}
							Pause
						{/if}
					</Button>
					{#if (!data.entry?.bookmark?.status || !data.entry?.bookmark?.bookmarked_at) && $page.data.saveToLibraryForm}
						<SaveToLibraryButton form={$page.data.saveToLibraryForm} />
					{:else}
						<LibraryForm
							entryId={data.entry?.id}
                            type={data.entry?.type}
							status={data.entry?.bookmark?.status}
                            variant="secondary"
						/>
					{/if}
					{#if loaded}
						<Button size="icon" variant="secondary" on:click={audioPlayer.clear}>
							<Stop />
						</Button>
					{/if}
					<Button
						size="icon"
						variant="secondary"
						on:click={() => (noting = !noting)}
					>
						<Pencil2 class="h-4 w-4" />
					</Button>
					<!-- TODO: show save to ilbrary / status etc -->
					<div class="flex items-center gap-2">
						<!-- <BookmarkForm data={data.bookmarkForm} /> -->
						{#if data.entry}
							<!-- <EntryOperations data={data.annotationForm} entry={data.entry} /> -->
						{/if}
					</div>
				</div>
			</div>
		</div>
		{#if noting}
			<AddInlineAnnotation
				on:cancel={() => {
					noting = false;
				}}
				on:save={() => {
					noting = false;
				}}
				media={isMediaType($page.params.type) && $page.params.id
					? makeMediaSchema(
							$page.params.type === 'podcast'
								? $page.params.id.slice(1)
								: $page.params.id,
							$page.params.type,
					  )
					: undefined}
				entryId={data?.entry?.id}
			/>
			<!-- <Editor id={data.entry?.id} on:save={(e) => {
				console.log({e})
			}} /> -->
		{:else}
			<div class="prose prose-stone space-y-4 dark:prose-invert">
				<div>
					{@html data.podcast.episode.description}
				</div>
			</div>
		{/if}
	</div>
{/if}
