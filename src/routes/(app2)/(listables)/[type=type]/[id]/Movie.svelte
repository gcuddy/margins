<script lang="ts">
	import { createAvatar, melt } from '@melt-ui/svelte';

	import smoothload from '$lib/actions/smoothload';
	import type { List } from '$lib/api/tmdb';
	import Cluster from '$lib/components/helpers/Cluster.svelte';
	import { Badge } from '$components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import ISO6391 from 'iso-639-1';
	import { iso31661 } from 'iso-3166';

	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
	} from '$lib/components/ui/dialog';
	import * as Card from '$components/ui/card';
	import * as Collapsible from '$components/ui/collapsible';
	import * as Tabs from '$components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Select from '$components/ui/select';
	import { Circle, PlusCircled } from 'radix-icons-svelte';

	import { H1, H3, Lead, Muted } from '$lib/components/ui/typography';
	import type { FullEntryDetail } from '$lib/queries/server';
	import { cn } from '$lib/utils';
	import { formatDate, isUpcoming, sortByDate } from '$lib/utils/date';

	import BookmarkForm from './BookmarkForm.svelte';
	import EntryOperations from './EntryOperations.svelte';
	import { enhance } from '$app/forms';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import {
	CalendarPlusIcon,
		ExternalLinkIcon,
		EyeIcon,
		ListPlus,
		PlusCircle,
		YoutubeIcon,
	} from 'lucide-svelte';
	import { mutate, qquery } from '$lib/queries/query';
	import { toast } from 'svelte-sonner';
	import { objectEntries, styleToString } from '$lib/helpers';
	import type { FastAverageColorResult } from 'fast-average-color';
	import { derived } from 'svelte/store';
	import { onNavigate } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { navigating, page } from '$app/stores';
	import Clamp from '$components/Clamp.svelte';
	import { defaultStringifySearch } from '$lib/utils/search-params';
	import { filterLibrary } from '$lib/schemas/library';
	import Skeleton from '$components/ui/skeleton/Skeleton.svelte';
	import MovieCarousel from '$components/movies/movie-carousel.svelte';
	import StarRating from '$components/ui/star-rating/star-rating.svelte';
	import StarRatingForm from '$components/ui/star-rating/star-rating-form.svelte';
	import LogInteractionForm from '$components/entries/interaction-form/log-interaction-form.svelte';
	import LogInteractionDialog from '$components/entries/interaction-form/log-interaction-dialog.svelte';
	import StatusIcon from '$components/entries/StatusIcon.svelte';
	import { getStatusIcon, statuses, statusesToDisplay } from '$lib/status';
	import StatusSelect from '$components/status/status-select.svelte';
	import SaveToLibraryButton from '$components/entries/save-to-library-button.svelte';
	import LibraryForm from '$components/ui/library/library-form.svelte';
	import { entryTypeIcon } from '$components/entries/icons';

	export let data: FullEntryDetail & {
		movie: NonNullable<FullEntryDetail['movie']>;
	};

	$: console.log({
		movie: data.movie,
	});
	// $: backdrop = data.movie.images.backdrops[0]
	// 	? `https://image.tmdb.org/t/p/original/${data.movie.images.backdrops[0]?.file_path}`
	// 	: null;

	// $: colorQuery = createQuery({
	// 	enabled: !!backdrop,
	// 	queryFn: async () => {
	// 		const response = await fetch(
	// 			`/api/color?uri=${encodeURIComponent(backdrop!)}`,
	// 		);
	// 		if (!response.ok) {
	// 			throw new Error('Network response was not ok');
	// 		}
	// 		return response.json() as Promise<FastAverageColorResult>;
	// 	},
	// 	queryKey: ['imageColor', backdrop],
	// });

	// $: colorHex = derived(colorQuery, ($colorQuery) => {
	// 	return $colorQuery.data?.hex;
	// });

	// $: backdropIsDark = derived(colorQuery, ($colorQuery) => {
	// 	return $colorQuery.data?.isDark;
	// });

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

	// TODO: use derived store / wait for svelte 5 for better reactivity
	$: relatedFilmsQuery = createQuery({
		enabled: !!data.movie.belongs_to_collection,
		queryFn: () =>
			qquery($page, 'movieCollection', data.movie.belongs_to_collection?.id),
		queryKey: ['relatedFilms', data.movie.belongs_to_collection?.id],
	});

	const {
		elements: { image, fallback },
		options,
		states: { loadingStatus },
	} = createAvatar({
		src: `https://image.tmdb.org/t/p/w342/${data.movie.poster_path}`,
	});

	let posterTooltips: Record<number, boolean> = {};

	$: console.log({ posterTooltips });

	let backdropLoaded = false;

	let isCastExpanded = false;

	function getCrewMember(job: string) {
		return data.movie.credits.crew.filter((c) => c.job === job);
	}

	const crewJobs = [
		'Director',
		'Screenplay',
		'Characters',
		'Casting',
		['Director of Photography', 'Cinematography'],
		['Original Music Composer', 'Score'],
		'Editor',
	];
</script>

<div class="pb-8">
	<div class="flex select-text flex-col gap-4">
		<div
			class={cn(
				'flex gap-6 max-sm:flex-col sm:items-center relative rounded-md overflow-hidden',
				// backdropIsDark && 'dark',
			)}
		>
			<!-- style:--backdropColor={$colorHex} -->
			<!-- style={styleToString({
            'background-image':`url(https://image.tmdb.org/t/p/original/${data.movie.images.backdrops[0].file_path})`,
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
        })} -->
			<!-- {#if backdrop && $colorQuery.isSuccess} -->
			<!-- <img
					alt=""
					src={backdrop}
					class="absolute inset-0 opacity-75 blur-sm z-[-1] rounded-md max-h-[300px] w-full object-cover animate-in fade-in-0"
					in:fade
					on:load={() => {
						backdropLoaded = true;
					}}
				/>
				<div class="absolute inset-0 z-[-1] rounded-full" /> -->
			<!-- {/if} -->
			<div
				class="aspect-auto rounded-md shadow-background shrink-0 sm:w-[150px] md:w-[200px]"
				style:view-transition-name="artwork-{data.movie.id}"
			>
				<!-- style:--tw-shadow-color={$colorHex} -->
				<!-- use:melt={$image} -->
				<img
					src="https://image.tmdb.org/t/p/w342{data.movie.poster_path}"
                    width={342}
                    height={513}
					class="aspect-auto rounded-[inherit] border shrink-0"
					alt="Movie poster for {data.movie.title}"
				/>
				<!-- <img
					use:melt={$image}
					class="aspect-auto w-[inherit] rounded-[inherit] border shrink-0"
					alt="Movie poster for {data.movie.title}"
				/> -->
				<!-- <div
					class={cn(
						'w-[200px] h-[300px] bg-muted flex items-center justify-center text-muted-foreground',
						$loadingStatus === 'loading' && 'animate-pulse',
					)}
					use:melt={$fallback}
				>
					{#if $loadingStatus === 'error'}
						{data.movie.title}
					{/if}
				</div> -->
			</div>
			<!-- <img
                src="https://image.tmdb.org/t/p/w500/{data.movie.poster_path}"
                alt=""
                class="aspect-auto rounded-md shadow-lg sm:w-[150px] md:w-[200px]"
                use:smoothload
            /> -->

			<div class="flex flex-col gap-8 justify-between rounded p-1">
				<div class="flex flex-col gap-2">
					<a
						href="/library/all{defaultStringifySearch(
							filterLibrary({
								type: 'movie',
							}),
						)}"><Muted class="text-foreground">Movie</Muted></a
					>
					<div class="flex items-baseline gap-x-2">
						<H1 class=" text-foreground">{data.movie.title}</H1>
						<a
							href="/library/all{defaultStringifySearch(
								filterLibrary({
									published: {
										// get first day of year
										gte: new Date(
											new Date(data.movie.release_date).getFullYear(),
											0,
											1,
										),
										// get last day of year
										lte: new Date(
											new Date(data.movie.release_date).getFullYear(),
											11,
											31,
										),
									},
								}),
							)}"
							class="text-muted-foreground underline underline-offset-2 decoration-border hover:text-primary"
						>
							{new Date(data.movie.release_date).getFullYear()}
						</a>
					</div>
					{#if data.movie.original_title !== data.movie.title}
						<Muted class="text-foreground">'{data.movie.original_title}'</Muted>
					{/if}
					<span class="text-muted-foreground">
						Directed by {#if director}
							<a
								class="underline underline-offset-2 decoration-border hover:text-primary"
								href="/people/t{director.id}">{director.name}</a
							>
						{/if}
					</span>
				</div>
				<!-- <Lead class="text-base  text-foreground">
					Screenplay:
					{#each writers as writer}
						<a href="/people/t{writer.id}">{writer.name}</a>{' '}
					{/each}
				</Lead> -->
				<div class="flex flex-col gap-4">
					{#key data.movie.id}
						<StarRatingForm
							entryId={data.entry?.id}
							rating={data.entry?.bookmark?.rating ?? 0}
						/>
					{/key}
					<div class="flex items-center gap-2">
						<!-- <BookmarkForm data={data.bookmarkForm} /> -->
						<!-- <pre>{JSON.stringify(data.entry?.interaction, null, 2)}</pre> -->
						{#if !data.entry?.bookmark?.status}
                            <!-- <SaveToLibraryButton icon={entryTypeIcon["movie"]} /> -->
                            <LibraryForm unsavedStyle="arrow" status={data.entry?.bookmark?.status ?? undefined} variant="outline" type="movie" entryId={data.entry?.id} tmdbId={data.movie.id} />

							<!-- <Button
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
								variant="default"
							>
								<StatusIcon status="Backlog" class="w-4 h-4 mr-2" />
								To Watch</Button
							> -->
						{:else if data.entry?.bookmark?.status}
							<!-- <StatusSelect
								entryId={data.entry.id}
								status={data.entry.bookmark?.status}
							/> -->
                            <LibraryForm status={data.entry.bookmark?.status} variant="outline" type={data.entry.type} entryId={data.entry.id} />
							<!-- <Button variant="outline">
                                <StatusIcon status="Backlog" class="w-4 h-4 mr-2 shrink-0" />
                                In {data.entry.bookmark?.status}</Button
                            > -->
						{/if}
						<!-- <form
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
                                variant="outline"
                                name="finished"
                                value={new Date().toISOString()}
                            >
                                <EyeIcon class="w-4 h-4 mr-2" />
                                Watch</Button
                            >
                        </form> -->
						<!-- <Button
                                variant="secondary"
                            >
                                <ListPlus class="w-4 h-4 mr-2" />
                                Add to collection...</Button
                            > -->
						{#if data.entry}
							<!-- <EntryOperations data={data.annotationForm} entry={data.entry} /> -->
						{/if}
						{#if $page.data.logInteractionForm}
							<LogInteractionDialog
								entry={{
									title: data.movie.title,
									type: 'movie',
									published: new Date(data.movie.release_date),
									image: `https://image.tmdb.org/t/p/w500/${data.movie.poster_path}`,
									tmdbId: data.movie.id,
								}}
								entryId={data.entry?.id}
								form={$page.data.logInteractionForm}
							>
								<svelte:fragment slot="trigger" let:builder>
									<Button
										builders={[builder]}
										variant="outline"
										name="finished"
										value={new Date().toISOString()}
									>
										<!-- <EyeIcon class="w-4 h-4 mr-2" /> -->
										<CalendarPlusIcon class="w-4 h-4 mr-2 stroke-[1.5]" />
										Log</Button
									>
								</svelte:fragment>
							</LogInteractionDialog>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="prose prose-stone space-y-4 dark:prose-invert mt-6">
			{#if data.movie.tagline}
				<Lead>
					{data.movie.tagline}
				</Lead>
			{/if}
			<div>
				{@html data.movie.overview}
			</div>
			<div class="flex text-sm text-muted-foreground not-prose items-center">
				<span>{data.movie.runtime} min</span>
				<span class="mx-2">•</span>
				<span>{ISO6391.getName(data.movie.original_language)}</span>
				{#if upcoming}
					<span class="mx-2">•</span>
					<span>Upcoming</span>
				{/if}
				<span class="mx-2">•</span>
				<div class="flex gap-1">
					<Badge
						variant="outline"
						as="a"
						class="inline-flex items-baseline"
						target="_blank"
						rel="noopener"
						href="https://imdb.com/title/{data.movie.imdb_id}"
						>IMDB
						<ExternalLinkIcon class="h-3 w-3 ml-1 relative top-[.125em]" />
					</Badge>
					<!-- TODO: this should be a setting if we should show it or not... -->
					<Badge
						variant="outline"
						as="a"
						class="inline-flex items-baseline"
						target="_blank"
						rel="noopener"
						href="https://letterboxd.com/tmdb/{data.movie.id}/"
						>Letterboxd
						<ExternalLinkIcon class="h-3 w-3 ml-1 relative top-[.125em]" />
					</Badge>
				</div>
				{#if data.movie.videos.results.length}
					{@const trailer = data.movie.videos.results.find(
						(v) => v.type === 'Trailer' && v.site === 'YouTube',
					)}
					{#if trailer}
						<span class="ml-2">•</span>
						<Dialog>
							<DialogTrigger asChild let:builder>
								<Button builders={[builder]} size="sm" variant="ghost">
									<YoutubeIcon class="w-4 h-4 mr-2" />
									Watch trailer
								</Button>
							</DialogTrigger>
							<!-- <svelte:fragment slot="trigger">
            <Button>Watch trailer</Button>
        </svelte:fragment> -->
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
			</div>
			<!-- images -->
			<!-- <div>
				{#each data.movie.images.backdrops.slice(0, 3) as image}
					<img
						src="https://image.tmdb.org/t/p/w500/{image.file_path}"
						alt=""
						class="aspect-video h-auto w-auto rounded-md"
						use:smoothload
					/>
				{/each}
			</div> -->
		</div>

		<!-- <pre>
            {JSON.stringify(data.movie, null, 2)}
        </pre> -->
	</div>

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
							<a href="/lists/t{list.id}">{list.name}</a>
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

	<div class="flex flex-col gap-6">
		<Card.Root class="max-w-prose mt-9">
			<Tabs.Root>
				<Card.Header>
					<Tabs.List>
						{#if data.movie.credits.cast.length}
							<Tabs.Trigger class="grow" value="cast">Cast</Tabs.Trigger>
						{/if}
						<Tabs.Trigger class="grow" value="crew">Crew</Tabs.Trigger>
						<Tabs.Trigger class="grow" value="details">Details</Tabs.Trigger>
						<!-- TODO: Releases (check release_dates api endpoint) -->
						<!-- <Tabs.Trigger class="grow" value="releases">Releases</Tabs.Trigger> -->
					</Tabs.List>
				</Card.Header>
				<Card.Content>
					{#if data.movie.credits.cast.length}
						<Tabs.Content value="cast">
							<Collapsible.Root bind:open={isCastExpanded}>
								<dl class="flex flex-col gap-y-1 text-sm">
									<!-- whoopsie repeating -->
									{#each data.movie.credits.cast.slice(0, 10) as { character, id, name } (id)}
										<div class="grid grid-cols-2">
											<dt class="font-medium">
												<a
													class="hover:text-primary transition-colors mr-1"
													href="/people/t{id}">{name}</a
												>
											</dt>
											<dd class="text-muted-foreground">
												{character}
											</dd>
										</div>
									{/each}
									<Collapsible.Content class="flex flex-col gap-y-1 text-sm">
										{#each data.movie.credits.cast.slice(10) as { character, id, name } (id)}
											<div class="grid grid-cols-2">
												<dt class="font-medium">
													<a
														class="hover:text-primary transition-colors mr-1"
														href="/people/t{id}">{name}</a
													>
												</dt>
												<dd class="text-muted-foreground">
													{character}
												</dd>
											</div>
										{/each}
									</Collapsible.Content>
									{#if data.movie.credits.cast.length > 10}
										<Collapsible.Trigger class="w-fit font-semibold mt-2">
											{isCastExpanded ? 'Show Less' : 'Show All'}
										</Collapsible.Trigger>
									{/if}
								</dl>
							</Collapsible.Root>
						</Tabs.Content>
					{/if}
					<Tabs.Content value="crew">
						<dl class="flex flex-col gap-y-1">
							{#each crewJobs as job}
								{@const crewJob = Array.isArray(job) ? job[0] : job}
								{@const displayJob = Array.isArray(job) ? job[1] : job}
								{#if crewJob}
									{@const members = getCrewMember(crewJob)}
									{#if members.length}
										<div class="grid grid-cols-2 text-sm">
											<dt class="font-medium">{displayJob}</dt>
											<dd>
												{#each members as { id, name }, index (id)}
													<a
														class="hover:text-primary transition-colors"
														href="/people/t{id}">{name.trim()}</a
													><span
														>{#if index < members.length - 1 && members.length !== 1},
														{/if}</span
													>
												{/each}
											</dd>
										</div>
									{/if}
								{/if}
							{/each}
						</dl>
					</Tabs.Content>
					<Tabs.Content value="details">
						<dl class="flex flex-col gap-y-1">
							<div class="grid grid-cols-2 text-sm">
								<dt class="font-medium">Genre</dt>
								<dd>
									{data.movie.genres.map((genre) => genre.name).join(', ')}
								</dd>
							</div>
							{#if data.movie.keywords?.keywords?.length}
								<div class="grid grid-cols-2 text-sm">
									<dt class="font-medium">Keywords</dt>
									<dd>
										{data.movie.keywords?.keywords
											.map((genre) => genre.name)
											.join(', ')}
									</dd>
								</div>
							{/if}
							<div class="grid grid-cols-2 text-sm">
								<dt class="font-medium">
									{data.movie.production_countries.length > 1
										? 'Countries'
										: 'Country'}
								</dt>
								<dd>
									{data.movie.production_countries
										.map((country) => country.name)
										.join(', ')}
								</dd>
							</div>
							<div class="grid grid-cols-2 text-sm">
								<dt class="font-medium">
									{data.movie.production_companies.length > 1
										? 'Studios'
										: 'Studio'}
								</dt>
								<dd>
									{data.movie.production_companies
										.map((studio) => studio.name)
										.join(', ')}
								</dd>
							</div>
							{#if data.movie.budget}
								<div class="grid grid-cols-2 text-sm">
									<dt class="font-medium">Budget</dt>
									<dd>
										{new Intl.NumberFormat('en-US', {
											currency: 'USD',
											maximumFractionDigits: 2,
											minimumFractionDigits: 0,
											style: 'currency',
										}).format(data.movie.budget)}
									</dd>
								</div>
								<div class="grid grid-cols-2 text-sm">
									<dt class="font-medium">Revenue</dt>
									<dd>
										{new Intl.NumberFormat('en-US', {
											currency: 'USD',
											maximumFractionDigits: 2,
											minimumFractionDigits: 0,
											style: 'currency',
										}).format(data.movie.revenue)}
									</dd>
								</div>
							{/if}
						</dl>
					</Tabs.Content>
					<!-- <Tabs.Content value="releases">
                        {@const premieres = data.movie.release_dates.results
                            .flatMap((c) =>
                                c.release_dates
                                    .filter((r) => r.type === 1)
                                    .map((r) => ({ ...r, iso_3166_1: c.iso_3166_1 }))
                                    .filter(Boolean),
                            )
                            .filter(Boolean)}
                        {#each sortByDate(premieres, 'release_date', 'asc') as premiere}
                            <div class="flex gap-x-6 text-muted-foreground">
                                <span class="text-sm tabular-nums shrink-0 min-w-[120px]"
                                    >{formatDate(premiere.release_date, {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}</span
                                >
                                <div class="flex grow items-center text-sm">
                                    <img
                                        alt=""
                                        class="rounded-[3px] w-6 shrink"
                                        src="http://purecatamphetamine.github.io/country-flag-icons/3x2/{premiere.iso_3166_1}.svg"
                                    />
                                    <span class="grow">
                                        {iso31661.find((c) => c.alpha2 === premiere.iso_3166_1)?.name}
                                    </span>
                                </div>
                            </div>
                        {/each}
                    </Tabs.Content> -->
				</Card.Content>
			</Tabs.Root>
		</Card.Root>
		<!-- <Cluster class="max-w-prose gap-1"> -->
		<!-- </Cluster> -->
		{#if data.movie.belongs_to_collection}
			<Card.Root class="max-w-prose">
				<Card.Header>
					<Card.Title>Related Films</Card.Title>
					<Card.Description>
						{data.movie.belongs_to_collection.name}
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="flex">
						{#if $relatedFilmsQuery.data}
							<MovieCarousel
								movies={$relatedFilmsQuery.data.parts.filter(
									(r) => r.id !== data.movie.id && r.poster_path,
								)}
							/>
						{:else}
							{#each new Array(3) as _}
								<Skeleton class="w-24 h-32 rounded-md" />
							{/each}
						{/if}
					</div>
				</Card.Content>
			</Card.Root>
		{/if}
		{#if data.movie.recommendations.results.length}
			<Card.Root class="max-w-prose">
				<Card.Header>
					<Card.Title>Recommendations</Card.Title>
				</Card.Header>
				<Card.Content>
					<MovieCarousel
						movies={data.movie.recommendations.results.filter((r) => {
							if ($relatedFilmsQuery.data) {
								return !$relatedFilmsQuery.data.parts.some(
									(p) => p.id === r.id,
								);
							}
							return true;
						})}
					/>
				</Card.Content>
			</Card.Root>
		{/if}
	</div>
</div>

<style>
	.noise {
		background-image: url("data:image/svg+xml,%3C!-- svg: first layer --%3E%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
	}
</style>
