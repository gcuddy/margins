<script lang="ts" context="module">
	import { onDestroy, onMount, tick } from 'svelte';
	import { derived, writable } from 'svelte/store';

	type Audio = {
		artist: string;
		/** *entry* id that we can use to update interaction */
		entry_id?: number;
		image?: string;
		interaction_id?: number;
		/** slug ala /:type/:id */
		slug?: string;
		src: string;
		title: string;
	};

	type State = {
		currentTime: number;
		duration: number;
		loaded: boolean;
		loading: boolean;
		paused: boolean;
		playbackRate: number;
		progress: number;
	};

	type Store = {
		audio: Audio | null;
		events?: Events;
		height: number;
		state: State;
	};

	type Events = {
		onProgressUpdate?: (progress: number) => void;
	};

	const default_state: Store = {
		audio: null,
		height: 0,
		state: {
			currentTime: 0,
			duration: 0,
			loaded: false,
			loading: false,
			paused: true,
			playbackRate: 1,
			progress: 0,
		},
	};

	let onload: ((state: State) => Partial<State>) | null = null;

	function createPodcastStore() {
		const { set, subscribe, update } = writable<Store>(default_state);
		return {
			clear: () => {
				set(default_state);
			},
			load: (audio: Audio, progress?: number | null, events?: Events) => {
				let play = false;
				update((store) => {
					if (store.audio?.src === audio.src) {
						return store;
					}
					play = true;
					if (progress) {
						onload = (state) => {
							return {
								currentTime: progress * state.duration,
							};
						};
					} else {
						store.state.currentTime = 0;
					}
					return {
						...store,
						audio,
						events,
						state: {
							...store.state,
							loaded: false,
							loading: true,
						},
					};
				});
				if (!play) {
					return;
				}
				tick().then(() => {
					audio_el.play();
				});
			},
			pause: () => {
				update((store) => {
					store.state.paused = true;
					return store;
				});
			},
			play: () => {
				update((store) => {
					store.state.paused = false;
					return store;
				});
			},
			set,
			skipBackward: () => {
				update((store) => {
					if (!store.audio) {
						return store;
					}
					const currentTime = store.state.currentTime;
					const newTime = currentTime - 30;
					audio_el.currentTime = newTime < 0 ? 0 : newTime;
					return store;
				});
			},
			skipForward: () => {
				update((store) => {
					if (!store.audio) {
						return store;
					}
					const duration = store.state.duration;
					const currentTime = store.state.currentTime;
					const newTime = currentTime + 30;
					audio_el.currentTime = newTime > duration ? duration : newTime;
					return store;
				});
			},
			subscribe,
			toggle: () => {
				update((store) => {
					store.state.paused = !store.state.paused;
					return store;
				});
			},
			update,
		};
	}
	export const audioPlayer = createPodcastStore();
	let audio_el: HTMLAudioElement;
</script>

<script lang="ts">
	import throttle from 'lodash/throttle';
	import {
		ListOrderedIcon,
		MessageSquare,
		PauseIcon,
		PlayIcon,
		SkipBackIcon,
		SkipForwardIcon,
		XIcon,
	} from 'lucide-svelte';
	import { Play, Pause, TrackPrevious, TrackNext } from 'radix-icons-svelte';
	import { fly } from 'svelte/transition';

	import { create_mutation } from '$lib/state/query-state';
	import player from '$lib/stores/player';
	import { formatTimeDuration } from '$lib/utils/dates';
	import { cn } from '$lib/utils/tailwind';

	import { Button } from './ui/button';
	import Slider from './ui/Slider.svelte';
	import { tweened } from 'svelte/motion';
	import { sleep } from '$lib/utils';

	const timestamp = derived(audioPlayer, ($audioPlayer) =>
		$audioPlayer.state.currentTime
			? Math.floor($audioPlayer.state.currentTime)
			: 0,
	);
	let className = '';
	export { className as class };
	// export let collapsed = false;

	// const saveInteraction = createMutation({
	// 	mutationFn: (data: MutationInput<'saveInteraction'>) =>
	// 		mutation($page, 'saveInteraction', data),
	// 	onSuccess(data, variables, context) {
	// 		variables;
	// 	}
	// });

	const saveInteraction = create_mutation('saveInteraction');

	// const { debounce: debounced_save, cancel } = debounce(5000);

	const progress = derived(
		[timestamp, audioPlayer],
		([$timestamp, $audioPlayer]) => {
			if (!$audioPlayer.audio?.entry_id) {
				return;
			}
			if ($audioPlayer.state.duration === 0) {
				return;
			}
			return $timestamp / $audioPlayer.state.duration;
		},
	);

	$: if ($progress !== undefined && $audioPlayer.events?.onProgressUpdate) {
		$audioPlayer.events.onProgressUpdate($progress);
	}

	const save = throttle(
		() => {
			// console.log('saving', $audioPlayer);
			if (!$audioPlayer.audio?.entry_id) {
				return;
			}
			// REVIEW: does this cause bugs if the audio src changes?
			$saveInteraction.mutate({
				entryId: $audioPlayer.audio.entry_id,
				id: $audioPlayer.audio.interaction_id,
				progress: $timestamp / $audioPlayer.state.duration,
			});
		},
		5000,
		{
			leading: false,
			trailing: true,
		},
	);

	const unsubscribe_timestamp = timestamp.subscribe(($timestamp) => {
		// save progress
		// console.log($timestamp);
		if ($timestamp === 0) {
			return;
		}
		if (!$audioPlayer.audio?.entry_id) {
			return;
		}
		if ($audioPlayer.state.duration === 0) {
			return;
		}
		// console.log({ $saveInteraction });
		if ($saveInteraction.isPending) {
			return;
		}
		save();
	});

	onDestroy(() => {
		unsubscribe_timestamp();
	});

	$: if (!$audioPlayer.state.paused) {
		// if playing, set global player store
		player.set({
			// REVIEW: should we set the store, or the value of the store?
			player: audioPlayer,
			timestamp: $audioPlayer.state.currentTime,
			type: 'audio',
		});
	}

	let borderBoxSize: Array<{ blockSize: number; inlineSize: number }>;

	$: $audioPlayer.height = borderBoxSize?.[0]?.blockSize ?? 0;

	let title_el: HTMLElement;

	const titleTranslateX = tweened(0);
	let titleScrollWidth = 0;
	let titleClientWidth = 0;
	$: isTitleTruncated = titleScrollWidth > titleClientWidth;

	// $: if (isTitleTruncated) {
	// 	console.log('isTitleTruncated', { titleScrollWidth, titleClientWidth });
	// 	titleTranslateX.set(-1 * (titleScrollWidth - titleClientWidth + 24), {
	// 		duration: 10000,
	// 		easing: (t) => t,
	// 		delay: 1000,
	// 	}).then(() => {
	//         titleTranslateX.set(0, {
	//             duration: 0,
	//         });
	//     });
	// } else {
	// 	titleTranslateX.set(0, {
	// 		duration: 0,
	// 	});
	// }

	$: if (title_el) {
		handle_resize();
	}

	let isTitleTweening = false;

	async function scrollTitle() {
		isTitleTweening = true;
		await titleTranslateX.set(-1 * (titleScrollWidth - titleClientWidth + 24), {
			duration: 10000,
			easing: (t) => t,
			delay: 1000,
		});
		await sleep(1000);
		await titleTranslateX.set(0, {
			duration: 10000,
			easing: (t) => t,
			delay: 1000,
		});
		isTitleTweening = false;
	}

	function handle_resize() {
		console.log('resize', { title_el });
		if (title_el) {
			titleScrollWidth = title_el.scrollWidth;
			titleClientWidth = title_el.clientWidth;
			console.log({ titleScrollWidth, titleClientWidth });
			let isTitleTruncated = titleScrollWidth > titleClientWidth;
			if (isTitleTruncated) {
				scrollTitle();
			} else {
				titleTranslateX.set(0, {
					duration: 0,
				});
			}
		}
	}

	onMount(handle_resize);
</script>

<svelte:window
	on:resize={handle_resize}
	on:keydown={(e) => {
		if (!$audioPlayer.audio?.src) {
			return;
		}

		if (e.target instanceof HTMLInputElement) {
			return;
		}
		if (e.key === ' ') {
			e.preventDefault();
			audioPlayer.toggle();
		}
	}}
/>

{#if $audioPlayer.audio?.src}
	<!-- <button on:click={save}> Save Progress </button> -->
	<!-- bind:paused={$audioPlayer.state.paused}
			bind:currentTime={$audioPlayer.state.currentTime}
			bind:duration={$audioPlayer.state.duration}

}			bind:playbackRate={$audioPlayer.state.playbackRate} -->
	<div
		transition:fly={{ duration: 100, y: 100 }}
		class="fixed bottom-0 left-0 right-0 w-full border-t"
		bind:borderBoxSize
	>
		<div class={cn('relative flex gap-y-4 bg-popover p-4', className)}>
			<div class="absolute right-0 top-0">
				<Button
					size="sm"
					variant="ghost"
					class="p-1"
					on:click={audioPlayer.clear}
				>
					<XIcon class="h-3 w-3" />
				</Button>
			</div>
			<div class="grid grid-cols-10 gap-4 w-full">
				<div class="flex gap-3 pt-2 col-span-3">
					<img
						class="aspect-square w-14 h-14 object-cover shrink-0 gap-1 rounded-md"
						alt=""
						src={$audioPlayer.audio.image}
					/>
					<div class="flex min-w-0 flex-col">
						<a
							on:mouseover={() => {
								if (!isTitleTweening) {
									scrollTitle();
								}
							}}
							bind:this={title_el}
							href={$audioPlayer.audio.slug}
							class="overflow-hidden text-sm/4 font-medium whitespace-nowrap relative after:w-1/4 after:absolute after:right-0 after:h-full after:bg-gradient-to-r after:from-transparent after:to-background after:top-0"
						>
							<div
								style:--trans-x="{$titleTranslateX}px"
								class="flex pr-2 pl-1 whitespace-nowrap w-fit translate-x-[--trans-x]"
							>
								<span>{$audioPlayer.audio.title}</span>
							</div>
						</a>
						<span class="text-sm/4 text-muted-foreground">
							{$audioPlayer.audio.artist}
						</span>
					</div>
				</div>
				<div class="flex flex-col gap-1 col-span-4">
					<div class="grid grid-cols-6 items-center">
						<div />
						<div class="col-span-4 col-start-2 flex justify-center">
							<Button
								variant="ghost"
								size="sm"
								on:click={() => ($audioPlayer.state.currentTime -= 30)}
							>
								<TrackPrevious class="h-5 w-5" />
							</Button>
							<Button variant="ghost" size="sm" on:click={audioPlayer.toggle}>
								{#if $audioPlayer.state.paused}
									<Play class="h-5 w-5" />
								{:else}
									<Pause class="h-5 w-5" />
								{/if}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								on:click={() => ($audioPlayer.state.currentTime += 30)}
							>
								<TrackNext class="h-5 w-5" />
							</Button>
						</div>
						<!-- <div class="col-span-1 flex justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreHorizontalIcon class="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem
                                        on:click={() => {
                                            // useTimeStampNote($timestamp, (body) => {
                                            // 	if (!$audioPlayer.audio?.entry_id) {return;}
                                            // 	mutation($page, 'save_note', {
                                            // 		body,
                                            // 		entryId: $audioPlayer.audio.entry_id,
                                            // 		target: {
                                            // 			selector: {
                                            // 				conformsTo: 'http://www.w3.org/TR/media-frags/',
                                            // 				type: 'FragmentSelector',
                                            // 				value: `t=${$timestamp}`
                                            // 			},
                                            // 			source: $audioPlayer.audio.src
                                            // 		},
                                            // 		type: 'annotation'
                                            // 	});
                                            // });
                                        }}>Take note</DropdownMenuItem
                                    >
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div> -->
					</div>
					<div class="flex flex-col">
						<Slider
							--thumb="12px"
							min={0}
							max={$audioPlayer.state.duration}
							bind:value={$audioPlayer.state.currentTime}
						/>
						<div class="mt-1 flex justify-between">
							<span class="text-xs/none tabular-nums text-muted-foreground"
								>{formatTimeDuration($timestamp, 'seconds')}</span
							>
							<span class="text-xs/none tabular-nums text-muted-foreground"
								>{formatTimeDuration(
									$audioPlayer.state.duration,
									'seconds',
								)}</span
							>
						</div>
					</div>
				</div>
				<!-- Controls -->
				<div class="flex col-span-3 justify-end">
					<Button size="icon" variant="ghost">
						<MessageSquare />
					</Button>
					<Button size="icon" variant="ghost">
						<ListOrderedIcon />
					</Button>
					<!-- ENtry Operations -->
					<!-- <EntryOperations /> -->
				</div>
			</div>
		</div>
	</div>
	<audio
		src={$audioPlayer.audio.src}
		bind:paused={$audioPlayer.state.paused}
		bind:currentTime={$audioPlayer.state.currentTime}
		bind:duration={$audioPlayer.state.duration}
		bind:playbackRate={$audioPlayer.state.playbackRate}
		bind:this={audio_el}
		on:loadstart={(e) => {
			$audioPlayer.state.loading = true;
		}}
		on:loadedmetadata={(e) => {
			$audioPlayer.state.loading = false;
			// console.log(e, $audioPlayer);
			if (onload) {
				// console.log({ onload });
				const { currentTime } = onload($audioPlayer.state);
				// console.log({ currentTime });
				$audioPlayer.state.currentTime = currentTime || 0;
				onload = null;
			}
		}}
		preload="auto"
	/>
{/if}
