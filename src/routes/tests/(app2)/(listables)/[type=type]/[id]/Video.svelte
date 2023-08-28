<script lang="ts" context="module">
	// export const player = writable<YouTubePlayer | undefined>(undefined);
</script>

<script lang="ts">
	import { PlayCircleIcon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import { readable, writable } from 'svelte/store';
	import type { YouTubePlayer } from 'youtube-player/dist/types';

	import { page } from '$app/stores';
	import Editor from '$components/ui/editor/Editor.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Youtube from '$lib/components/Youtube.svelte';
	import player_store from '$lib/stores/player';

	export let player: YouTubePlayer | undefined = undefined;

	const play_state = writable<'playing' | 'paused' | 'ended' | 'buffering' | 'cued' | 'unstarted'>(
		'unstarted'
	);

	$: if (player) {
		player_store.set({
			type: 'youtube',
			player,
			timestamp: 0
		});
	}
	export let data: {
		entry?: {
			youtubeId: string;
			text: string;
		};
	};
	$: youtubeId = data.entry?.youtubeId;
	let timestamp = 0;
	let annotating = false;
	$: console.log({ annotating });

	let width = 640;
	$: height = width * 0.5625;

	let loaded = false;

	let Youtube: ComponentType | undefined = undefined;

	async function loadYoutube() {
		loaded = true;
		Youtube = (await import('$lib/components/Youtube.svelte')).default;
	}

	let playing = false;

	export async function seek(num: number) {
		if (!player) return;
		const state = await player.getPlayerState();
		console.log({ state });
		if (state !== -1) {
			console.log('seeking');
			if (state === 5) {
				await player.playVideo();
				await player.seekTo(num, true);
			}
		}
		// const time = await player.getCurrentTime();
		// player.seekTo(time + num, true);
	}

	// let t: string | undefined = undefined;
	$: t = $page.url.searchParams.get('t');
	$: [start] = t?.split(',') || [];
	$: if (start && player) {
		console.log('seeking');
		seek(+start);
	}
</script>

<div>
	{#if youtubeId}
		<div class="relative flex aspect-video">
			{#if !loaded}
				<img
					class="absolute inset-0 object-cover"
					src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
					alt=""
				/>
				<button on:click={loadYoutube}>
					<PlayCircleIcon
						class="absolute inset-0 m-auto fill-muted-foreground/80 stroke-accent backdrop-blur-sm"
						size={64}
					/>
				</button>
			{:else if Youtube}
				<svelte:component
					this={Youtube}
					options={{
						playerVars: {
							autoplay: 1
						}
					}}
					on:ready={() => {
						console.log('ready');
						player?.playVideo();
					}}
					on:stateChange={(e) => {
						console.log({ e });
						if (e.detail.data === 1) {
							// then it's playing
							console.log('PLAYING');
							playing = true;
						} else {
							playing = false;
						}
					}}
					{width}
					{height}
					videoId={youtubeId}
					bind:player
				/>
			{/if}
		</div>
		{#if player}
			<div class="my-2 flex justify-end">
				<Button
					on:click={async () => {
						console.log(player);
						// timestamp = await player?.getCurrentTime();
						console.log({ timestamp });
						annotating = !annotating;
					}}>Annotate</Button
				>
			</div>
		{/if}
		{#if annotating}
			<Editor />
		{:else}
			<div class="prose whitespace-pre-line">
				{data.entry?.text}
			</div>
		{/if}
	{:else}
		<div class="flex h-64 items-center justify-center">
			<div class="text-2xl text-muted">No video</div>
		</div>
	{/if}
</div>
