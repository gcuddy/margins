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
	let episode: ApiResponse.EpisodeById["episode"] | PIApiEpisodeInfo;
	let entry: Entry | null | undefined = undefined;

	export let episodeId: number;

	const query = createQuery({
		...podcastEpisodeQuery($page, episodeId),
		staleTime: 1000 * 60,
		onSuccess: (data) => {
			episode = data.episode;
			entry = data.entry;
		},
	});

	$: loaded = $podcastPlayer.episode?.enclosureUrl === episode?.enclosureUrl;
	$: console.log({ episode, entry });

	// $: feedTitle =
	// 	"feedTitle" in episode
	// 		? episode.feedTitle
	// 		: $page.data.queryClient.getQueryData<ApiResponse.PodcastById>(["podcasts", "detail", episode.feedId])
	// 				?.feed?.title;

	let feedTitle = "";
	// or just query instead?
	// $: bookmarked = $page.data.user?.bookmarks.find((b) => b.entry?.podcastIndexId === episode.id);
	// $: console.log({ bookmarked });

	// const collectionQuery = createQuery(listCollectionsQuery)
</script>

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
			class="h-60 w-60 place-self-center rounded-xl shadow-lg sm:place-self-start"
		/>
		<div class="flex flex-col text-center sm:text-left">
			<h1 class="text-2xl font-bold">{episode.title}</h1>
			<a class="text-xl" href="/podcasts/{episode.feedId}"><Muted>{feedTitle}</Muted></a>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div>
				<Muted class="text-sm uppercase">{formatDate(dayjs.unix(episode.datePublished))}</Muted>
			</div>
			<div class="flex w-full items-center text-sm transition-[width]">
				<Progress
					class="h-1 appearance-none rounded-full bg-gray-500 transition-[width] dark:bg-gray-600/50 {loaded
						? 'mr-2 w-24'
						: 'w-0'} {$podcastPlayer.loading ? 'animate-pulse' : ''}"
					innerClass="bg-gradient-to-r from-primary-500 to-primary-600"
					value={typeof $podcastPlayer.currentTime === "number" && loaded ? $podcastPlayer.currentTime : 0}
					max={typeof $podcastPlayer.duration === "number" && loaded ? $podcastPlayer.duration : 1}
					min={0}
				/>
				<Muted
					>{loaded
						? formatDuration($podcastPlayer.duration - $podcastPlayer.currentTime, "seconds") + " left"
						: formatDuration(episode.duration, "seconds")}
				</Muted>
			</div>
			<Muted class="text-xs uppercase">podcast episode</Muted>
			<div class="mt-auto">
				<div class="flex items-center gap-2">
					<Button
						className="flex gap-1"
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
					>
						<Button type="submit" className="flex items-center gap-0.5" variant="ghost">
							<Icon name="plusMini" className="h-4 w-4 fill-current" /> Save
						</Button>
					</form>
					<DotMenu
						placement="top-start"
						class="p-1"
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
