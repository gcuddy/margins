<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import AnnotationModal from "$lib/components/annotations/AnnotationModal.svelte";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Button from "$lib/components/Button.svelte";
	import DotMenu from "$lib/components/DotMenu.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import Progress from "$lib/components/helpers/Progress.svelte";
	import { podcastPlayer } from "$lib/components/PodcastPlayer.svelte";
	import dayjs from "$lib/dayjs";
	import { modals } from "$lib/stores/modals";
	import { trpc } from "$lib/trpc/client";
	import { formatDate, formatDuration } from "$lib/utils/dates";
	import { DocumentType, Entry } from "@prisma/client";
	import { createQuery } from "@tanstack/svelte-query";
	import type {
		ApiResponse,
		PIApiEpisodeDetail,
		PIApiEpisodeInfo,
		PIApiPodcast,
	} from "podcastdx-client/dist/src/types";
	import { listCollectionsQuery } from "../collections/queries";
	import { addEntriesToCollection } from "../collections/stores";
	import { podcastEpisodeQuery } from "./queries";
	let episode: PIApiEpisodeDetail;
	let entry: Entry | null | undefined = undefined;

	export let episodeId: number;

	export let title = "";
	export let feedTitle = "";
	$: feedTitle = episode?.feedTitle;
	$: title = episode?.title;

	const query = createQuery({
		...podcastEpisodeQuery($page, episodeId),
		staleTime: 1000 * 60,
		onSuccess: (data) => {
			episode = data.episode;
			entry = data.entry;
		},
	});

	$: loaded = episode?.enclosureUrl && $podcastPlayer.episode?.enclosureUrl === episode?.enclosureUrl;
	$: console.log({ episode, entry });

	// $: feedTitle =
	// 	"feedTitle" in episode
	// 		? episode.feedTitle
	// 		: $page.data.queryClient.getQueryData<ApiResponse.PodcastById>(["podcasts", "detail", episode.feedId])
	// 				?.feed?.title;

	// or just query instead?
	// $: bookmarked = $page.data.user?.bookmarks.find((b) => b.entry?.podcastIndexId === episode.id);
	// $: console.log({ bookmarked });

	// const collectionQuery = createQuery(listCollectionsQuery)
</script>

{#if entry}
	<!-- <ReadingMenu/> -->
{/if}

{#if $query.isLoading}
loading...
{:else if $query.isError}
error
{:else if $query.isSuccess}
	{@const { episode, entry } = $query.data}
	<div class="relative flex flex-col space-y-8 sm:flex-row sm:space-y-0 sm:space-x-12">
		<!-- <img
        src={image}
        class="absolute h-full w-full opacity-25 blur-3xl"
        alt="Artwork for {title}"
    /> -->

		<img
			src={episode.image || episode.feedImage}
			class="max-h-60 w-60 place-self-center rounded-xl shadow-lg sm:place-self-start"
		/>
		<div class="flex flex-col justify-between text-center sm:text-left">
			<div class="flex flex-col">
				<div class="flex w-full items-center gap-3 text-sm max-sm:justify-center">
					<div>
						<Muted class="text-xs uppercase">{formatDate(dayjs.unix(episode.datePublished))}</Muted>
					</div>
					<Muted
						>{loaded
							? formatDuration($podcastPlayer.duration - $podcastPlayer.currentTime, "seconds") + " left"
							: formatDuration(episode.duration, "seconds")}
					</Muted>
				</div>
				<h1 class="text-2xl font-bold">{episode.title}</h1>
				<a class="text-lg" href="/podcasts/{episode.feedId}"><Muted>{episode.feedTitle}</Muted></a>
				<Muted class="text-xs uppercase">podcast episode</Muted>
			</div>
			<div
				class="mt-4 flex grid-cols-2 grid-rows-2 flex-wrap items-center gap-2 max-sm:mx-auto max-sm:grid max-sm:w-44 max-sm:justify-center"
			>
				<Button
					className="flex gap-1 col-span-2 w-44"
					on:click={() => {
						if (loaded) {
							podcastPlayer.toggle();
						} else {
							console.log("loading");
							$podcastPlayer.loading = true;
							podcastPlayer.load(
								{
									...episode,
								},
								{
									title: feedTitle,
								}
							);
						}
					}}
				>
					{#if loaded && !$podcastPlayer.paused}
						<Icon name="pauseMini" className="h-4 w-4 fill-current" /> <span>Pause</span>
					{:else}
						<Icon name="playMini" className="h-4 w-4 fill-current" /> <span>Play</span>
					{/if}
				</Button>
				<form
					action="/podcasts/{episode.feedId}/{episode.id}?/save"
					method="post"
					use:enhance={() => {
						return async ({ update, result }) => {
							console.log({ result });
							update();
						};
					}}
					class="col-start-1 row-start-2"
				>
					<Button type="submit" className="flex items-center gap-0.5" variant="ghost">
						<Icon name="plusMini" className="h-4 w-4 fill-current" /> Save
					</Button>
				</form>
				<DotMenu
					placement="top-start"
					class="col-start-2 row-start-2 mx-auto p-1"
					items={[
						[
							{
								label: "Annotate",
								icon: "chatBubbleBottomCenterTextMini",
								perform: () => {
									modals.open(AnnotationModal, {
										timestamp: $podcastPlayer.currentTime ? Math.floor($podcastPlayer.currentTime) : 0,
										entryId: $podcastPlayer.episode?.id,
										source: $podcastPlayer.episode?.enclosureUrl,
									});
								},
							},
						],
						[
							{
								label: "Add to collection",
								icon: "viewGridAddSolid",
								perform: async () => {
									// create entry if it doesn't exist
									let id = 0;
									if (entry) {
										id = entry.id;
									} else {
										const entry = await trpc().entries.create.mutate({
											// TODO: copied from podcasts.ts, should be a function
											data: {
												podcastIndexId: BigInt(episode.id),
												title: episode.title,
												published: dayjs.unix(episode.datePublished).toDate(),
												enclosureUrl: episode.enclosureUrl,
												enclosureType: episode.enclosureType,
												enclosureLength: episode.enclosureLength,
												summary: episode.description,
												duration: episode.duration,
												uri: episode.link || episode.enclosureUrl,
												guid: episode.guid,
												image: episode.image || episode.feedImage,
												type: DocumentType.audio,
											},
										});
										id = entry.id;
									}
									addEntriesToCollection($page.data.queryClient, [id]);
								},
							},
						],
					]}
				/>
			</div>
			<!-- TODO: categories here -->
		</div>
	</div>

	<div class="relative overflow-hidden p-4 text-sm">
		<div class="prose prose-stone text-sm  leading-normal dark:prose-invert">
			{@html episode.description}
		</div>
	</div>
{/if}
