<script lang="ts">
	import { createAvatar, melt } from '@melt-ui/svelte';

	import smoothload from '$lib/actions/smoothload';
	import type { List } from '$lib/api/tmdb';
	import Cluster from '$lib/components/helpers/Cluster.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
	} from '$lib/components/ui/dialog';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { H1, H3, Lead, Muted } from '$lib/components/ui/typography';
	import type { FullEntryDetail } from '$lib/queries/server';
	import { cn } from '$lib/utils';
	import { isUpcoming } from '$lib/utils/date';

	import BookmarkForm from './BookmarkForm.svelte';
	import EntryOperations from './EntryOperations.svelte';
	import { enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { EyeIcon, ListPlus, PlusCircle } from 'lucide-svelte';
	import { mutate } from '$lib/queries/query';
	import { toast } from 'svelte-sonner';

	export let data: FullEntryDetail & {
		movie: NonNullable<FullEntryDetail['movie']>;
	};

	const queryClient = useQueryClient();

	$: director = data.movie.credits.crew.find((c) => c.job === 'Director');
	$: writers = data.movie.credits.crew.filter((c) => c.job === 'Screenplay');

	$: upcoming = isUpcoming(new Date(data.movie.release_date));

	const promises = {
		lists: () =>
			fetch(`/api/tmdb/movie/${data.movie.id}/lists`).then((r) =>
				r.json(),
			) as Promise<{ results: Array<List> }>,
	};

	$: ({
		elements: { image, fallback },
		options,
		states: { loadingStatus },
	} = createAvatar({
		src: `https://image.tmdb.org/t/p/w342/${data.movie.poster_path}`,
	}));

	let posterTooltips: Record<number, boolean> = {};

	$: console.log({ posterTooltips });
</script>

<div class="">
	<div class="flex select-text flex-col gap-4">
		<div class="flex gap-6 max-sm:flex-col sm:items-center">
			<div class="aspect-auto rounded-md shadow-lg sm:w-[150px] md:w-[200px]">
				<img
					use:melt={$image}
					class="aspect-auto w-[inherit] rounded-[inherit] border"
					alt="Movie poster for {data.movie.title}"
				/>
				<div
					class={cn(
						'w-[200px] h-[300px] bg-muted flex items-center justify-center text-muted-foreground',
						$loadingStatus === 'loading' && 'animate-pulse',
					)}
					use:melt={$fallback}
				>
					<!--  -->
					{#if $loadingStatus === 'error'}
						{data.movie.title}
					{/if}
				</div>
			</div>
			<!-- <img
                src="https://image.tmdb.org/t/p/w500/{data.movie.poster_path}"
                alt=""
                class="aspect-auto rounded-md shadow-lg sm:w-[150px] md:w-[200px]"
                use:smoothload
            /> -->
			<div class="flex flex-col gap-2">
				<Muted>Movie</Muted>
				<H1>{data.movie.title}</H1>
				<Lead>
					{#if director}
						<a href="/tests/people/t{director.id}">{director.name}</a>{/if} — {new Date(
						data.movie.release_date,
					).getFullYear()}
				</Lead>
				<Lead class="text-base">
					Screenplay:
					{#each writers as writer}
						<a href="/tests/people/t{writer.id}">{writer.name}</a>{' '}
					{/each}
				</Lead>
				{#if upcoming}
					<span class="text-xs text-slate-500 dark:text-slate-400"
						>Upcoming</span
					>
				{/if}
				<div class="flex items-center gap-2">
					<!-- <BookmarkForm data={data.bookmarkForm} /> -->
					<!-- <pre>{JSON.stringify(data.entry?.interaction, null, 2)}</pre> -->
					{#if !data.entry?.bookmark}
						<Button
							on:click={async () => {
								try {
									await mutate('save_to_library', {
										entryId: data.entry?.id,
										status: 'Backlog',
										tmdbId: data.movie.id,
										type: 'movie',
									});
									toast.success('Saved movie to Backlog');
								} catch (error) {
									if (error instanceof Error) {
										toast.error(error.message);
									}
								} finally {
									queryClient.invalidateQueries({
										queryKey: ['entries'],
									});
								}
							}}
							variant="secondary"
						>
							<PlusCircle class="w-4 h-4 mr-2" />
							To Watch</Button
						>
					{/if}
					<form
						method="post"
						action="?/markFinished"
						use:enhance={() => {
							return () => {
								queryClient.invalidateQueries({
									queryKey: ['entries'],
								});
							};
						}}
					>
						<input type="hidden" name="entryId" value={data.entry?.id} />
						<Button
							variant="secondary"
							name="finished"
							value={new Date().toISOString()}
						>
							<EyeIcon class="w-4 h-4 mr-2" />
							Watch</Button
						>
					</form>
					<!-- <Button
							variant="secondary"
						>
							<ListPlus class="w-4 h-4 mr-2" />
							Add to collection...</Button
						> -->
					{#if data.entry}
						<EntryOperations data={data.annotationForm} entry={data.entry} />
					{/if}
				</div>
				<div class="flex items-center gap-x-2">
					<Badge
						variant="outline"
						as="a"
						href="https://imdb.com/title/{data.movie.imdb_id}">IMDB</Badge
					>
				</div>
			</div>
		</div>

		<dl class="grid grid-cols-[1fr,1fr,1fr] gap-3 pt-2 text-sm w-fit">
			<div class="flex flex-col">
				<dt class="text-xs uppercase"><Muted>Release Date</Muted></dt>
				<dd>
					<Muted>
						{data.movie.release_date}
					</Muted>
				</dd>
			</div>
			<div class="flex flex-col">
				<dt class="text-xs uppercase"><Muted>Runtime</Muted></dt>
				<dd>
					<Muted>
						{data.movie.runtime} minutes
					</Muted>
				</dd>
			</div>
		</dl>

		<div class="prose prose-stone space-y-4 dark:prose-invert">
			<div>
				{@html data.movie.overview}
			</div>
			<!-- images -->
			<div>
				{#each data.movie.images.backdrops.slice(0, 3) as image}
					<img
						src="https://image.tmdb.org/t/p/w500/{image.file_path}"
						alt=""
						class="aspect-video h-auto w-auto rounded-md"
						use:smoothload
					/>
				{/each}
			</div>
		</div>
	</div>

	{#if data.movie.videos.results.length}
		{@const trailer = data.movie.videos.results.find(
			(v) => v.type === 'Trailer' && v.site === 'YouTube',
		)}
		{#if trailer}
			<Dialog>
				<svelte:fragment slot="trigger">
					<Button>Watch trailer</Button>
				</svelte:fragment>
				<DialogContent class="sm:max-w-[75vw]">
					<iframe
						src="https://www.youtube.com/embed/{trailer.key}"
						class="aspect-video w-full p-2"
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					/>
				</DialogContent>
			</Dialog>
		{/if}
	{/if}

	<Dialog>
		<svelte:fragment slot="trigger">
			<Button>View Lists</Button>
		</svelte:fragment>
		<DialogContent class="sm:max-w-[75vw]">
			<DialogHeader>
				<DialogTitle>Lists</DialogTitle>
			</DialogHeader>
			<div class="flex flex-col overflow-y-auto">
				{#await promises.lists()}
					loading
				{:then { results: lists }}
					{#each lists.sort((a, b) => a.favorite_count - b.favorite_count) as list}
						<div class="flex items-center gap-2">
							<a href="/tests/lists/t{list.id}">{list.name}</a>
							{#if list.description}
								<Muted>{list.description}</Muted>
							{/if}
						</div>
					{/each}
				{:catch error}
					{error.message}
				{/await}
			</div>
		</DialogContent>
	</Dialog>
	<H3>Cast</H3>
	<!-- <Cluster class="max-w-prose gap-1"> -->
	<div class="max-w-prose">
		{#each data.movie.credits.cast.slice(0, 20) as { character, id, name } (id)}
			<a
				class="hover:text-primary tracking-tight transition-colors font-bold mr-1"
				href="/tests/people/t{id}">{name} ({character})</a
			>
			<!-- <Badge variant="secondary">{name}</Badge> -->
			<!-- <span
                            class="rounded-lg bg-slate-900 px-2 py-1 text-xs text-slate-50 dark:bg-slate-800 dark:text-slate-100"
                            >{name}</span
                        > -->
		{/each}
	</div>
	<!-- </Cluster> -->

	<H3>Related Films</H3>
	<div class="overflow-x-hidden">
		<div
			class="flex overflow-x-auto max-w-prose gap-2 py-4"
			on:scroll={() => {
				Object.keys(posterTooltips).forEach((key) => {
					posterTooltips[+key] = false;
				});
			}}
		>
			{#each data.movie.recommendations.results as recommendation (recommendation.id)}
				<Tooltip.Root
					openDelay={300}
					bind:open={posterTooltips[recommendation.id]}
				>
					<Tooltip.Trigger asChild let:builder>
						<a
							data-movie-thumbnail
							href="/tests/movie/{recommendation.id}"
							use:melt={builder}
							class=" w-24 h-auto object-cover shrink-0 block rounded shadow"
						>
							<img
								src="https://image.tmdb.org/t/p/w154/{recommendation.poster_path}"
								class="shrink-0 block rounded border"
								alt="Poster for {recommendation.title}"
							/>
							<span class="sr-only">{recommendation.title}</span>
						</a>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<span>{recommendation.title}</span>
					</Tooltip.Content>
				</Tooltip.Root>
			{/each}
		</div>
	</div>
	<dl />
</div>
