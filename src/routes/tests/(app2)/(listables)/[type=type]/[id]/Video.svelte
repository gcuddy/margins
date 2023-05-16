<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import type Youtube from '$lib/components/Youtube.svelte';
	import { PlayCircleIcon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import type { YouTubePlayer } from 'youtube-player/dist/types';
	export let player: YouTubePlayer | undefined = undefined;
	export let data: {
		entry?: {
			youtubeId: string;
		};
	};
	$: youtubeId = data.entry?.youtubeId;
	let timestamp = 0;
	let annotating = false;

	let width = 640;
	$: height = width * 0.5625;

	let loaded = false;

	let Youtube: ComponentType<Youtube> | undefined = undefined;

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
				<!-- <button on:click={loadYoutube}>load youtube</button> -->
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
						if (!player) return;
						timestamp = await player?.getCurrentTime();
						annotating = !annotating;
					}}
					variant="ghost">Annotate</Button
				>
			</div>
		{/if}
		<div class="prose whitespace-pre-line">
			<!-- {entry.text} -->
		</div>
	{:else}
		<div class="flex h-64 items-center justify-center">
			<div class="text-2xl text-muted">No video</div>
		</div>
	{/if}
</div>
