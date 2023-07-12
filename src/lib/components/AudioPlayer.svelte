<script lang="ts" context="module">
	import { onDestroy, tick } from 'svelte';
	import { derived, writable } from 'svelte/store';

	type Audio = {
		src: string;
		title: string;
		artist: string;
		/** *entry* id that we can use to update interaction */
		entry_id?: number;
		interaction_id?: number;
		/** slug ala /:type/:id */
		slug?: string;
		image?: string;
	};

	type State = {
		paused: boolean;
		currentTime: number;
		duration: number;
		playbackRate: number;
		loading: boolean;
		loaded: boolean;
		progress: number;
	};

	type API = {
		load: (audio: Audio, progress?: number | null) => void;
		toggle: () => void;
		clear: () => void;
	};

	type Store = {
		state: State;
		audio: Audio | null;
	};

	const default_state: Store = {
		state: {
			playbackRate: 1,
			currentTime: 0,
			duration: 0,
			loaded: false,
			loading: false,
			paused: true,
			progress: 0
		},
		audio: null
	};

	let onload: ((state: State) => Partial<State>) | null = null;

	function createPodcastStore() {
		const { subscribe, set, update } = writable<Store>(default_state);
		return {
			subscribe,
			set,
			update,
			clear: () => {
				set(default_state);
			},
			load: (audio: Audio, progress?: number | null) => {
				let play = false;
				update((store) => {
					if (store.audio?.src === audio.src) {
						return store;
					}
					play = true;
					if (progress) {
						console.log({ progress });
						onload = (state) => {
							return {
								currentTime: progress * state.duration
							};
						};
					} else {
						store.state.currentTime = 0;
					}
					return {
						...store,
						audio,
						state: {
							...store.state,
							loading: true,
							loaded: false
						}
					};
				});
				if (!play) return;
				tick().then(() => {
					console.log({ audio_el });
					audio_el?.play();
				});
			},
			skipForward: () => {
				update((store) => {
					if (!store.audio) return store;
					const duration = store.state.duration;
					const currentTime = store.state.currentTime;
					const newTime = currentTime + 30;
					if (newTime > duration) {
						audio_el.currentTime = duration;
					} else {
						audio_el.currentTime = newTime;
					}
					return store;
				});
			},
			skipBackward: () => {
				update((store) => {
					if (!store.audio) return store;
					const currentTime = store.state.currentTime;
					const newTime = currentTime - 30;
					if (newTime < 0) {
						audio_el.currentTime = 0;
					} else {
						audio_el.currentTime = newTime;
					}
					return store;
				});
			},
			toggle: () => {
				update((store) => {
					store.state.paused = !store.state.paused;
					return store;
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
			}
		};
	}
	export const audioPlayer = createPodcastStore();
	let audio_el: HTMLAudioElement;
</script>

<script lang="ts">
	import {
		MoreHorizontalIcon,
		PauseIcon,
		PlayIcon,
		SkipBackIcon,
		SkipForwardIcon,
		XIcon
	} from 'lucide-svelte';
	import Button, { buttonVariants } from './ui/Button.svelte';
	import Slider from './ui/Slider.svelte';
	import { formatTimeDuration } from '$lib/utils/dates';
	import { cn } from '$lib/utils/tailwind';
	import { createMutation } from '@tanstack/svelte-query';
	import { page } from '$app/stores';
	import { MutationInput, mutation } from '$lib/queries/query';
	import throttle from 'lodash/throttle';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from './ui/dropdown-menu';
	import { dialog_store } from './ui/singletons/Dialog.svelte';
	import Textarea from './ui/Textarea.svelte';
	import AnnotationForm from './AnnotationForm.svelte';
	import { useTimeStampNote } from './ui/singletons/dialogs';
	import { create_mutation } from '$lib/state/query-state';
	import player from '$lib/stores/player';

	const timestamp = derived(audioPlayer, ($audioPlayer) =>
		$audioPlayer.state.currentTime ? Math.floor($audioPlayer.state.currentTime) : 0
	);
	let className = '';
	export { className as class };
	export let collapsed = false;

	// const saveInteraction = createMutation({
	// 	mutationFn: (data: MutationInput<'saveInteraction'>) =>
	// 		mutation($page, 'saveInteraction', data),
	// 	onSuccess(data, variables, context) {
	// 		variables;
	// 	}
	// });

	const saveInteraction = create_mutation('saveInteraction');



	// const { debounce: debounced_save, cancel } = debounce(5000);

	const save = throttle(
		() => {
			console.log('saving', $audioPlayer);
			if (!$audioPlayer.audio?.entry_id) return;
			// REVIEW: does this cause bugs if the audio src changes?
			$saveInteraction.mutate({
				entryId: $audioPlayer.audio.entry_id,
				id: $audioPlayer.audio?.interaction_id,
				progress: $timestamp / $audioPlayer.state.duration
			});
		},
		5000,
		{
			leading: false,
			trailing: true
		}
	);

	const unsubscribe_timestamp = timestamp.subscribe(($timestamp) => {
		// save progress
		console.log($timestamp);
		if ($timestamp === 0) return;
		if (!$audioPlayer.audio?.entry_id) return;
		if ($audioPlayer.state.duration === 0) return;
		console.log({ $saveInteraction });
		if ($saveInteraction.isPending) return;
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
			type: "audio",
			timestamp: $audioPlayer.state.currentTime
		})
	}
</script>

{#if $audioPlayer?.audio?.src}
	<!-- <button on:click={save}> Save Progress </button> -->
	<!-- bind:paused={$audioPlayer.state.paused}
			bind:currentTime={$audioPlayer.state.currentTime}
			bind:duration={$audioPlayer.state.duration}

}			bind:playbackRate={$audioPlayer.state.playbackRate} -->
	{#if !collapsed}
		<div class={cn('relative flex flex-col gap-y-4 bg-popover p-4', className)}>
			<div class="absolute right-0 top-0">
				<Button size="sm" variant="ghost" class="p-1" on:click={audioPlayer.clear}>
					<XIcon class="h-3 w-3" />
				</Button>
			</div>
			<div class="flex gap-3 pt-2">
				<img
					class="aspect-square w-12 h-12 object-cover shrink-0 gap-1 rounded-md"
					alt=""
					src={$audioPlayer.audio.image}
				/>
				<div class="flex min-w-0 flex-col">
					<svelte:element
						this={$audioPlayer.audio?.slug ? 'a' : 'span'}
						href={$audioPlayer.audio?.slug}
						class="line-clamp-2 text-sm/4 font-medium"
					>
						{$audioPlayer.audio.title}
					</svelte:element>
					<span class="text-sm/4 text-muted-foreground">
						{$audioPlayer.audio.artist}
					</span>
				</div>
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
						>{formatTimeDuration($audioPlayer.state.duration, 'seconds')}</span
					>
				</div>
			</div>
			<div class="grid grid-cols-6 items-center">
				<div />
				<div class="col-span-4 col-start-2 flex justify-center">
					<Button variant="ghost" size="sm" on:click={() => ($audioPlayer.state.currentTime -= 30)}>
						<SkipBackIcon />
					</Button>
					<Button variant="ghost" size="sm" on:click={audioPlayer.toggle}>
						{#if $audioPlayer.state.paused}
							<PlayIcon />
						{:else}
							<PauseIcon />
						{/if}
					</Button>
					<Button variant="ghost" size="sm" on:click={() => ($audioPlayer.state.currentTime += 30)}>
						<SkipForwardIcon />
					</Button>
				</div>
				<div class="col-span-1 flex justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<MoreHorizontalIcon class="h-4 w-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								on:click={() => {
									useTimeStampNote($timestamp, (body) => {
										if (!$audioPlayer.audio?.entry_id) return;
										mutation($page, 'save_note', {
											entryId: $audioPlayer.audio.entry_id,
											body,
											type: 'annotation',
											target: {
												source: $audioPlayer.audio.src,
												selector: {
													type: 'FragmentSelector',
													conformsTo: 'http://www.w3.org/TR/media-frags/',
													value: `t=${$timestamp}`
												}
											}
										});
									});
								}}>Take note</DropdownMenuItem
							>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	{:else}
		<!-- Collapsed version: just artwork with play/pause overlayed on top of it -->
		<div class="relative mx-auto my-4 h-12 w-12 overflow-hidden">
			<img
				class="aspect-square w-12 shrink-0 gap-1 rounded-md"
				alt=""
				src={$audioPlayer.audio.image}
			/>
			<div
				class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity focus-within:opacity-100 hover:opacity-100"
			>
				<Button
					variant="ghost"
					size="sm"
					class="w-9 rounded-full p-0"
					on:click={audioPlayer.toggle}
				>
					{#if $audioPlayer.state.paused}
						<PlayIcon />
					{:else}
						<PauseIcon />
					{/if}
				</Button>
			</div>
		</div>
	{/if}
	<audio
		src={$audioPlayer?.audio.src}
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
			console.log(e, $audioPlayer);
			if (onload) {
				console.log({ onload });
				const { currentTime } = onload($audioPlayer.state);
				console.log({ currentTime });
				$audioPlayer.state.currentTime = currentTime || 0;
				onload = null;
			}
		}}
		preload="auto"
	/>
{/if}
