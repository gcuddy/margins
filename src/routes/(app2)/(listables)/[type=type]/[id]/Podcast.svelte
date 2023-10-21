<script lang="ts">
	import { page } from '$app/stores';
	import AddInlineAnnotation from '$components/annotations/add-inline-annotation.svelte';
	import { EntryMediaHeader } from '$components/entries';
	import SaveToLibraryButton from '$components/entries/save-to-library-button.svelte';
	import Editor from '$components/ui/editor/Editor.svelte';
	import LibraryForm from '$components/ui/library/library-form.svelte';
	import smoothload from '$lib/actions/smoothload';
	import { audioPlayer } from '$lib/components/AudioPlayer.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Dialog, DialogContent } from '$lib/components/ui/dialog';
	import { H1, Lead, Muted } from '$lib/components/ui/typography';
	import { formatDate, isUpcoming } from '$lib/utils/date';
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
		<EntryMediaHeader
			title={episode.title}
			type="podcast"
			image={data.podcast.episode.image || data.podcast.episode.feedImage}
		>
			<svelte:fragment slot="meta">
				<a href="/show/p{episode.feedId}">{episode.feedTitle}</a>
				<span>
					{formatDate(episode.datePublished * 1000)}
				</span>
			</svelte:fragment>
			<svelte:fragment slot="actions">
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
									data.podcast.episode.image || data.podcast.episode.feedImage,
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
				<LibraryForm
					bodyPortal
					unsavedStyle="arrow"
					status={data.entry?.bookmark?.status ?? undefined}
					variant="secondary"
					type="podcast"
					entryId={data.entry?.id}
					podcastIndexId={episode?.id}
				/>
				{#if loaded}
					<Button size="icon" variant="secondary" on:click={audioPlayer.clear}>
						<Stop />
					</Button>
					<Button
						size="icon"
						variant="secondary"
						on:click={() => (noting = !noting)}
					>
						<Pencil2 class="h-4 w-4" />
					</Button>
				{/if}
			</svelte:fragment>
		</EntryMediaHeader>
		
		<div class="mt-8">
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
	</div>
{/if}
