<script lang="ts" context="module">
	import type { PodcastEpisode } from "$lib/types/schemas/Podcast";
	import { post } from "$lib/utils";
	import { formatTimeDuration } from "$lib/utils/dates";
	import dayjs from "dayjs";
	import debounce from "lodash.debounce";
	import { onDestroy, tick } from "svelte";
	import { derived, writable } from "svelte/store";
	import { fly } from "svelte/transition";

	const default_state = {
		playbackRate: 1,
		currentTime: 0,
		duration: 0,
		loaded: false,
	};
	interface Episode {
		title: string | null;
		enclosureUrl: string;
		image?: string;
        // REVIEW: how are these 3 ids different?
		id?: number;
		pIndexId?: number;
		entryId?: number;
	}

	interface Podcast {
		title?: string | null;
		podcastIndexId?: number;
		image?: string;
	}

	type State = {
		episode?: Episode;
		paused?: boolean;
		podcast?: Podcast;
		currentTime: number;
		duration: number;
		playbackRate: number;
		loading?: boolean;
		loaded: boolean;
	};

	// type Podcast = PIApiPodcast;

	// TODO: set up queries and mutations to load and save progress, and additional episode metadata

	let onload: (() => Partial<State>) | null = null;

	function createPodcastStore() {
		const { subscribe, set, update } = writable<{
			episode?: Episode;
			paused?: boolean;
			podcast?: Podcast;
			currentTime: number;
			duration: number;
			playbackRate: number;
			loading?: boolean;
			loaded: boolean;
		}>(default_state);
		return {
			subscribe,
			set,
			update,
			clear: () => {
				set(default_state);
			},
			load: (episode: Episode, podcast?: Podcast, progress?: number | null) => {
				let play = false;
				update((state) => {
					if (state.episode?.id === episode.id) {
						return state;
					}
					play = true;
					if (progress) {
						onload = () => {
							return {
								currentTime: progress * audio.duration,
							};
						};
					}
					return {
						...state,
						loaded: true,
						episode,
						podcast,
						currentTime: 0,
						duration: 0,
					};
				});
				if (!play) return;
				tick().then((res) => {
					audio.play();
				});
			},
			toggle: () => {
				update((state) => {
					state.paused = !state.paused;
					return state;
				});
			},
		};
	}
	export const podcastPlayer = createPodcastStore();
	let audio: HTMLAudioElement;
</script>

<script lang="ts">
	import { goto } from "$app/navigation";

	import FakeSelect from "./atoms/FakeSelect.svelte";
	import Muted from "./atoms/Muted.svelte";
	import DotMenu from "./DotMenu.svelte";
	import Icon from "./helpers/Icon.svelte";
	import Progress from "./helpers/Progress.svelte";
	import { createMutation, createQuery } from "@tanstack/svelte-query";
	import { trpc } from "$lib/trpc/client";
	import { page } from "$app/stores";
	import { draggable } from "@neodrag/svelte";
	import { modals } from "$lib/stores/modals";
	import AnnotationModal from "./annotations/AnnotationModal.svelte";

	// derived
	const timestamp = derived(podcastPlayer, ($podcastPlayer) =>
		$podcastPlayer.currentTime ? Math.floor($podcastPlayer.currentTime) : 0
	);

	// const save = async () => {
	// 	console.log("saving");
	// 	const obj = {
	// 		id: $podcastPlayer.podcast?.id,
	// 		url: $podcastPlayer.episode?.enclosure?.url,
	// 		guid: $podcastPlayer.episode?.guid,
	// 		timestamp: $timestamp,
	// 	};
	// 	console.log({ obj });
	// 	await post("/api/set_podcast_progress", obj);
	// };

	let podcastIndexFeedId: number | undefined;
	$: query = createQuery({
		enabled: !!podcastIndexFeedId,
		queryKey: ["podcasts", "detail", podcastIndexFeedId],
		queryFn: async () =>
			trpc($page).podcasts.public.getPodcastDetailsByPodcastIndexId.query(podcastIndexFeedId as number),
		onSuccess: ({ feed }) => {
			console.log({ feed });
			$podcastPlayer.podcast = {
				title: feed.title,
				image: feed.artwork,
				podcastIndexId: feed.id,
			};
			// $podcastPlayer.podcast = {
			// 	title: feed.title,
			// 	creator: feed.author,
			// };
		},
		staleTime: 5 * 60 * 1000,
	});

	let prev_id: number | undefined;
	const unsubscribePodcastPlayer = podcastPlayer.subscribe((val) => {
		// console.log({ val });
		if (!val.episode?.pIndexId) return;
		console.log({ val });
		if (podcastIndexFeedId === val.episode?.pIndexId) return;
		podcastIndexFeedId = val.episode?.pIndexId;
		// if (podcastIndexFeedId) {
		// 	query = createQuery(podcastDetailsQuery($page, podcastIndexFeedId));
		// }
	});

	$: if (
		($podcastPlayer.episode?.id || $podcastPlayer.episode?.pIndexId) &&
		$podcastPlayer.duration &&
		$podcastPlayer.duration - $podcastPlayer.currentTime < 10
	) {
		trpc().podcasts.updateEpisodeInteraction.mutate({
			podcastIndexId: $podcastPlayer.episode?.entryId ? undefined : BigInt(+($podcastPlayer.episode?.pIndexId || $podcastPlayer.episode?.id)),
			entryId: $podcastPlayer.episode?.entryId,
			progress: 1,
			finished: true,
		});
	}

	// save time
	const debouncedSave = debounce(async () => {
		if (!$podcastPlayer.episode?.id || !$podcastPlayer.episode.entryId) return;
		trpc().podcasts.updateEpisodeInteraction.mutate({
			podcastIndexId: $podcastPlayer.episode.entryId ? undefined :  BigInt($podcastPlayer.episode.id),
			entryId: $podcastPlayer.episode.entryId,
			progress: $timestamp / $podcastPlayer.duration,
		});
		// $podcastPlayer.episode.entryId = interaction.entryId;
		// await post('/api/set_podcast_progress', {
		// 	id: $podcastPlayer.podcast?.id,
		// 	url: $podcastPlayer.episode?.enclosure?.url,
		// 	guid: $podcastPlayer.episode?.guid,
		// 	position: $timestamp / $podcastPlayer.duration,
		// });
	}, 3000);
	let lastTimeStamp: number | null = null;

	let timestamp_count = 0;
	const unsubscribeTimestamp = timestamp.subscribe((t) => {
		timestamp_count++;
		if (t === lastTimeStamp) return;
		if (!lastTimeStamp) {
			lastTimeStamp = t;
			return;
		}
		if (Math.abs(t - lastTimeStamp) < 10) return;
		debouncedSave();
		lastTimeStamp = t;
	});

	// if content has been playing for 60 seconds and hasn't been logged, log it

	const logMutation = createMutation({
		mutationKey: ["log", $podcastPlayer.episode?.entryId],
		mutationFn: async () =>
			trpc().log.push.mutate({
				entryId: $podcastPlayer.episode?.entryId as number,
			}),
		cacheTime: 60 * 1000 * 60,
	});

	let logged = false;
	$: if (timestamp_count > 45 && $podcastPlayer.episode?.entryId && !logged) {
		console.log("logging");
		$logMutation.mutate();
		logged = true;
	}

	// $logMutation

	// $: $timestamp, $podcastPlayer.episode ? debouncedSave() : null;
	onDestroy(() => {
		unsubscribeTimestamp();
		unsubscribePodcastPlayer();
	});
</script>

<div class="relative">
	{#if $podcastPlayer?.episode?.enclosureUrl}
		<figure
			transition:fly={{
				y: 10,
			}}
			use:draggable={{}}
			class="fixed bottom-0 right-0 w-full bg-elevation/50 p-1 shadow-2xl ring-1 ring-border backdrop-blur-md dark:bg-black sm:bottom-4 sm:right-4 sm:w-80 sm:rounded-lg sm:p-3"
		>
			<div class="w-full px-2 py-1">
				<div class="grid grid-cols-12 items-center justify-between sm:flex sm:flex-col sm:space-y-3">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- on:click={(e) =>
							goto(`/rss/podcasts/${$podcastPlayer.podcast.id}/${$podcastPlayer.episode.uuid}`)} -->
					<div class="col-span-9 flex w-full shrink cursor-default items-center gap-4">
						<img
							src={$podcastPlayer.episode?.image || $podcastPlayer.podcast?.image}
							class="h-12 w-12 shrink-0 rounded-lg shadow sm:h-14 sm:w-14"
							alt=""
						/>
						<div class="flex grow flex-col space-y-1 truncate text-sm sm:space-y-0">
							<span class="truncate font-medium">{$podcastPlayer.episode.title}</span>
							<Progress
								class="h-1 w-full appearance-none rounded-full bg-gray-500 transition-[width] dark:bg-gray-600/50 sm:hidden {$podcastPlayer.loading
									? 'animate-pulse'
									: ''}"
								innerClass="bg-gradient-to-r from-primary-500 to-primary-600"
								value={typeof $podcastPlayer.currentTime === "number" ? $podcastPlayer.currentTime : 0}
								on:click={(e) => {
									e.preventDefault();
									e.stopPropagation();
									console.log(e);
									const { offsetX } = e;
									const { duration } = $podcastPlayer;
									if (!duration) return;
									// @ts-ignore
									const time = (offsetX / e.target.offsetWidth) * duration;
									console.log({ time });
									$podcastPlayer.currentTime = time;
								}}
								max={typeof $podcastPlayer.duration === "number" ? $podcastPlayer.duration : 1}
								min={0}
							/>
							{#if $podcastPlayer.podcast?.title}
								<div class="hidden sm:inline-block">
									<Muted>{$podcastPlayer.podcast.title}</Muted>
								</div>
							{:else if podcastIndexFeedId && $query.isLoading}
								loading...
							{:else if $query.isSuccess}
								<div class="hidden sm:inline-block">
									<Muted>{$query.data.feed.title}</Muted>
								</div>
							{/if}
						</div>
						<button
							on:click={() => podcastPlayer.clear()}
							class="order-first mr-1 sm:order-last sm:mr-0 sm:place-self-start"
						>
							<Icon name="xSolid" className="h-3 w-3 sm:h-4 sm:w-4 fill-gray-500" />
						</button>
					</div>
					<div class=" hidden w-full flex-col sm:flex">
						<input
							type="range"
							min={0}
							max={$podcastPlayer.duration}
							bind:value={$podcastPlayer.currentTime}
						/>
						<div class="flex justify-between text-xs tabular-nums">
							<!-- TODO: fix these firing every ms or whatever -->
							<Muted>
								{formatTimeDuration($timestamp, "seconds")}
							</Muted>
							<Muted>
								-{formatTimeDuration($podcastPlayer.duration - $timestamp, "seconds")}
							</Muted>
						</div>
					</div>
					<div class="col-span-3 flex shrink-0 items-center justify-between sm:w-full">
						<FakeSelect class="hidden sm:block" bind:value={$podcastPlayer.playbackRate}>
							<option value={0.75}>.75x</option>
							<option value={1}>1x</option>
							<option value={1.25}>1.25x</option>
							<option value={1.5}>1.5x</option>
							<option value={1.75}>1.75x</option>
							<option value={2}>2x</option>
							<option value={2.5}>2.5x</option>
							<svelte:fragment let:value slot="label">
								<span class="text-sm">{value}x</span>
							</svelte:fragment>
						</FakeSelect>
						<div class="flex shrink-0 items-center space-x-1 ">
							<button
								class="hidden h-12 w-12 items-center justify-center rounded-full transition ease-out focus-visible:bg-gray-300/75 active:scale-90 active:bg-gray-300/75 dark:active:bg-gray-700/75 sm:flex"
								on:click={() => {
									$podcastPlayer.currentTime = $podcastPlayer.currentTime - 15;
								}}
							>
								<div class="flex flex-col items-center justify-center">
									<Icon name="arrowUTurnLeft" className="h-5 w-5 stroke-current stroke-2 fill-none" />
									<span class="text-xs font-medium"><Muted>-15s</Muted></span>
								</div>
							</button>
							<button
								class="flex h-12 w-12 items-center justify-center rounded-full transition ease-out focus-visible:bg-gray-300/75 active:scale-90 active:bg-gray-300/75 dark:active:bg-gray-700/75"
								on:click={podcastPlayer.toggle}
							>
								<Icon
									name={$podcastPlayer.paused ? "play" : "pause"}
									className="h-7 w-7 stroke-current stroke-2 fill-current"
								/>
							</button>
							<button
								class="flex h-12 w-12 items-center justify-center rounded-full transition ease-out focus-visible:bg-gray-300/75 active:scale-90 active:bg-gray-300/75 dark:active:bg-gray-700/75"
								on:click={() => {
									$podcastPlayer.currentTime = $podcastPlayer.currentTime + 30;
								}}
							>
								<div class="flex flex-col items-center justify-center">
									<Icon name="arrowUTurnRight" className="h-5 w-5 stroke-current stroke-2 fill-none" />
									<span class="text-xs">+30s</span>
								</div>
							</button>
						</div>
						<!-- placement="left"
          strategy="fixed" -->
						<div class="hidden sm:block">
							<DotMenu
								overlayClass="bg-black/25"
								items={[
									[
										{
											label: "Take annotation",
											icon: "pencilSolid",
                                            perform: () => {
                                                // open modal
                                                modals.open(AnnotationModal, {
                                                    timestamp: $timestamp,
                                                    entryId: $podcastPlayer.episode?.id,
                                                    source: $podcastPlayer.episode?.enclosureUrl
                                                })
                                            }
										},
									],
								]}
							/>
						</div>
					</div>
				</div>
				<!-- <button on:click={save}> Save Progress </button> -->
				<audio
					src={$podcastPlayer?.episode.enclosureUrl}
					bind:this={audio}
					bind:paused={$podcastPlayer.paused}
					bind:currentTime={$podcastPlayer.currentTime}
					bind:duration={$podcastPlayer.duration}
					bind:playbackRate={$podcastPlayer.playbackRate}
					on:loadedmetadata={(e) => {
						$podcastPlayer.loading = false;
						timestamp_count = 0;
						logged = false;
						if (onload) {
							const { currentTime } = onload();
							$podcastPlayer = { ...$podcastPlayer, currentTime: currentTime || 0 };
							onload = null;
						}
					}}
					preload="auto"
				/>
			</div>
		</figure>
	{/if}
</div>
