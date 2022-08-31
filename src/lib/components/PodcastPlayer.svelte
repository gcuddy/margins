<script lang="ts" context="module">
	import type { Podcast, PodcastEpisode } from '$lib/types/schemas/Podcast';
	import { post } from '$lib/utils';
	import { formatTimeDuration } from '$lib/utils/dates';
	import dayjs from 'dayjs';
	import debounce from 'lodash.debounce';
	import { onDestroy, tick } from 'svelte';
	import { derived, writable } from 'svelte/store';
	import { fly } from 'svelte/transition';

	const default_state = {
		playbackRate: 1,
		currentTime: 0,
	};
	function createPodcastStore() {
		const { subscribe, set, update } = writable<{
			episode?: PodcastEpisode;
			paused?: boolean;
			podcast?: Podcast;
			currentTime: number;
			duration?: number;
			playbackRate: number;
			loading?: boolean;
		}>(default_state);
		return {
			subscribe,
			set,
			update,
			clear: () => {
				set(default_state);
			},
			load: (episode: PodcastEpisode, podcast?: Podcast) => {
				let play = false;
				update((state) => {
					if (state.episode?.uuid === episode.uuid) {
						return state;
					}
					play = true;
					return {
						...state,
						episode,
						podcast,
						currentTime: 0,
						duration: 0,
					};
				});
				// set({
				// 	episode,
				// 	podcast,
				// 	currentTime: 0,
				// 	duration: 0,
				// });
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
	let audio: HTMLAudioElement | undefined;
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import FakeSelect from './atoms/FakeSelect.svelte';
	import Muted from './atoms/Muted.svelte';
	import DotMenu from './DotMenu.svelte';
	import Icon from './helpers/Icon.svelte';
	import Progress from './helpers/Progress.svelte';

	// derived
	const timestamp = derived(podcastPlayer, ($podcastPlayer) =>
		$podcastPlayer.currentTime ? Math.floor($podcastPlayer.currentTime) : 0
	);

	const save = async () => {
		console.log('saving');
		const obj = {
			id: $podcastPlayer.podcast?.id,
			url: $podcastPlayer.episode?.enclosure?.url,
			guid: $podcastPlayer.episode?.guid,
			timestamp: $timestamp,
		};
		console.log({ obj });
		await post('/api/set_podcast_progress', obj);
	};

	// save time
	const debouncedSave = debounce(async () => {
		console.log('saving time');
		// await post('/api/set_podcast_progress', {
		// 	id: $podcastPlayer.podcast?.id,
		// 	url: $podcastPlayer.episode?.enclosure?.url,
		// 	guid: $podcastPlayer.episode?.guid,
		// 	position: $timestamp / $podcastPlayer.duration,
		// });
	}, 10000);
	const unsubscribeTimestamp = timestamp.subscribe((t) => {
		console.log('timestamp change', t);
		debouncedSave();
	});
	// $: $timestamp, $podcastPlayer.episode ? debouncedSave() : null;
	onDestroy(unsubscribeTimestamp);
</script>

<div class="relative">
	{#if $podcastPlayer?.episode?.enclosure}
		<figure
			transition:fly={{
				y: 10,
			}}
			class="fixed bottom-0 right-0 w-full bg-amber-50/50 p-1 shadow-2xl ring-1 ring-black/5 backdrop-blur-md dark:bg-black sm:bottom-4 sm:right-4 sm:w-80 sm:rounded-lg sm:p-3"
		>
			<div class="w-full px-2 py-1">
				<div class="flex items-center justify-between sm:flex-col sm:space-y-3">
					<div
						class="flex w-full shrink cursor-default items-center gap-4"
						on:click={(e) => goto(`/rss/podcasts/+${$podcastPlayer.episode.id}`)}
					>
						<img
							src={$podcastPlayer.podcast?.image}
							class="h-12 w-12 shrink-0 rounded-lg shadow sm:h-14 sm:w-14"
							alt="Artwork for {$podcastPlayer.podcast.title}"
						/>
						<div class="flex grow flex-col space-y-1 truncate text-sm sm:space-y-0">
							<span class="truncate font-medium">{$podcastPlayer.episode.title}</span>
							<Progress
								class="h-1 w-full appearance-none rounded-full bg-gray-500 transition-[width] dark:bg-gray-600/50 sm:hidden {$podcastPlayer.loading
									? 'animate-pulse'
									: ''}"
								innerClass="bg-gradient-to-r from-primary-500 to-primary-600"
								value={typeof $podcastPlayer.currentTime === 'number'
									? $podcastPlayer.currentTime
									: 0}
								on:click={(e) => {
									e.preventDefault();
									e.stopPropagation();
									console.log(e);
									const { offsetX } = e;
									const { duration } = $podcastPlayer;
									const time = (offsetX / e.target.offsetWidth) * duration;
									console.log({ time });
									$podcastPlayer.currentTime = time;
								}}
								max={typeof $podcastPlayer.duration === 'number' ? $podcastPlayer.duration : 1}
								min={0}
							/>
							<div class="hidden sm:inline-block">
								<Muted>{$podcastPlayer.podcast?.title}</Muted>
							</div>
						</div>
						<button
							on:click={() => podcastPlayer.clear()}
							class="order-first mr-1 sm:order-last sm:mr-0 sm:place-self-start"
						>
							<Icon name="xSolid" className="h-3 w-3 sm:h-4 sm:w-4 fill-gray-500" />
						</button>
					</div>
					<div class="hidden w-full flex-col sm:flex">
						<input
							type="range"
							min={0}
							max={$podcastPlayer.duration}
							bind:value={$podcastPlayer.currentTime}
						/>
						<div class="flex justify-between text-xs tabular-nums">
							<!-- TODO: fix these firing every ms or whatever -->
							<Muted>
								{formatTimeDuration($timestamp, 'seconds')}
							</Muted>
							<Muted>
								-{formatTimeDuration($podcastPlayer.duration - $timestamp, 'seconds')}
							</Muted>
						</div>
					</div>
					<div class="flex shrink-0 items-center justify-between sm:w-full">
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
									<Icon
										name="arrowUTurnLeft"
										className="h-5 w-5 stroke-current stroke-2 fill-none"
									/>
									<span class="text-xs font-medium"><Muted>-15s</Muted></span>
								</div>
							</button>
							<button
								class="flex h-12 w-12 items-center justify-center rounded-full transition ease-out focus-visible:bg-gray-300/75 active:scale-90 active:bg-gray-300/75 dark:active:bg-gray-700/75"
								on:click={podcastPlayer.toggle}
							>
								<Icon
									name={$podcastPlayer.paused ? 'play' : 'pause'}
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
									<Icon
										name="arrowUTurnRight"
										className="h-5 w-5 stroke-current stroke-2 fill-none"
									/>
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
											label: 'Take annotation',
											icon: 'pencilSolid',
										},
									],
								]}
							/>
						</div>
					</div>
				</div>
				<!-- <button on:click={save}> Save Progress </button> -->
				<audio
					src={$podcastPlayer?.episode.enclosure.url}
					bind:this={audio}
					bind:paused={$podcastPlayer.paused}
					bind:currentTime={$podcastPlayer.currentTime}
					bind:duration={$podcastPlayer.duration}
					bind:playbackRate={$podcastPlayer.playbackRate}
					on:loadedmetadata={() => {
						$podcastPlayer.loading = false;
					}}
					preload="auto"
				/>
			</div>
		</figure>
	{/if}
</div>
