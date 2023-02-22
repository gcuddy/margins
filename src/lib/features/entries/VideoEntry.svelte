<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import RichAnnotationInput from "$lib/components/annotations/RichAnnotationInput.svelte";
	import Button from "$lib/components/Button.svelte";
	import Youtube from "$lib/components/Youtube.svelte";
	import dayjs from "$lib/dayjs";
	import { getContainerRefContext } from "$lib/features/entries/context";
	import type { RouterOutputs } from "$lib/trpc/router";
	import { createMutation, useQueryClient } from "@tanstack/svelte-query";
	import debounce from "lodash/debounce";
	import { nanoid } from "$lib/nanoid";
	import { fly, scale } from "svelte/transition";
	import type { RequireAtLeastOne } from "type-fest";
	import type { YouTubePlayer } from "youtube-player/dist/types";
	import { createAnnotationMutation } from "../annotations/mutations";
	import { entryDetailsQuery } from "./queries";
	type Entry = RouterOutputs["entries"]["load"];
	export let entry: RequireAtLeastOne<Entry, "youtubeId">;
	$: ({ youtubeId } = entry);
	export let player: YouTubePlayer | undefined = undefined;
	$: console.log({ player });
	let timestamp = 0;
	let annotating = false;

	const containerRef = getContainerRefContext();
	$: console.log({ $containerRef });

	let width = 640;
	$: height = width * 0.5625;

	let playing = false;
	const queryClient = useQueryClient();
	const debouncedSetWidth = debounce((w: number) => {
		width = Math.min(w * 0.9, 896);
	}, 200);
	// track size of containerRef with resizeobserver
	let resizeObserver: ResizeObserver;
	$: if (browser)
		resizeObserver = new ResizeObserver((entries) => {
			console.log(`containerRef`, entries);
			const entry = entries[0];
			const { width } = entry.contentRect;
			debouncedSetWidth(width);
		});
	$: if ($containerRef) resizeObserver.observe($containerRef);

	// REVIEW: switch to a "save"/upsert?
	$: queryKey = entryDetailsQuery({
		id: entry.id,
	}).queryKey;
	const createAnnotation = createMutation({
		...createAnnotationMutation($page),
		onMutate: async (data) => {
			// optimistic update
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<Entry>(queryKey);
			// @ts-expect-error
			queryClient.setQueryData<Entry>(queryKey, (old) => {
				if (!old) return;
				return {
					...old,
					annotations: [
						...old.annotations,
						{
							createdAt: new Date(),
							updatedAt: new Date(),
							type: "annotation",
							sortOrder: 0,
							private: true,
							id: "temp",
							creator: {
								username: $page.data.user?.username as string,
							},
							...data,
						},
					],
				};
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey,
			});
		},
	});

	async function seek(num: number) {
		if (!player) return;
		const state = await player.getPlayerState();
		console.log({ state });
		if (state !== -1) {
            console.log('seeking')
            if (state === 5) {
                await player.playVideo();
                await player.seekTo(num, true);
            }
		}
		// const time = await player.getCurrentTime();
		// player.seekTo(time + num, true);
	}

	// let t: string | undefined = undefined;
	$: t = $page.url.searchParams.get("t");
	$: [start] = t?.split(",") || [];
	$: if (start && player) {
		console.log("seeking");
		seek(+start);
		// player.getPlayerState()
		// player.seekTo(Number(start), true).then(() => {
		//     console.log("seeked")
		//     player?.playVideoAt(1)
		// })
	}

	// $: currentTime = readable(0, (set) => {
	//     if (!player) return;
	//     const interval = setInterval(() => {
	//         player?.getCurrentTime().then(set)
	//     }, 1000)
	//     return () => clearInterval(interval)
	// })
</script>

<!-- TODO: keep playing when changing pages by using some sort of layout/store/context -->

<!-- <button
	on:click={() => {
		player?.seekTo(start, true);
	}}>seek to t</button
> -->

{#if youtubeId}
	<!-- {playing} -->
	<!-- {$currentTime} -->
	<div class="flex aspect-video">
		<!-- TODO: vide osize -->
		<Youtube
			on:stateChange={(e) => {
				console.log({ e });
				if (e.detail.data === 1) {
					// then it's playing
					console.log("PLAYING");
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
	</div>
	<!-- <button
		on:click={async () => {
			if (!player) return;
			timestamp = await player.getCurrentTime();
		}}>get timestamp</button
	> -->
	<!-- REVIEW: design -->
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
	<!-- {timestamp} -->
	{#if annotating}
		<div
			in:fly={{
				y: -10,
				opacity: 0.75,
			}}
			out:scale
		>
			<!-- TODO: save as snapshot -->
			<RichAnnotationInput autofocus={true}>
				<div slot="bottom" let:contentData class="flex w-full justify-between px-4 pb-2 text-muted">
					<!-- format as mm:ss -->
					<button
						class="text-sm tabular-nums"
						on:click={async () => {
							// re-fetch timestamp
							if (!player) return;
							timestamp = await player?.getCurrentTime();
						}}>{dayjs.duration(timestamp, "s").format("mm:ss")}</button
					>
					<Button
						variant="ghost"
						on:click={() => {
							// TODO: maybe this should be a form instead for progressive enhancement
							$createAnnotation.mutate({
								id: nanoid(),
								entryId: entry.id,
								contentData,
								target: {
									source: entry.uri + `?t=${timestamp}` || "",
									selector: {
										type: "FragmentSelector",
										value: `t=${timestamp}`,
									},
								},
							});
							annotating = false;
						}}>Save</Button
					>
					<!-- {dayjs.duration($currentTime, "s").format("mm:ss")} -->
				</div>
			</RichAnnotationInput>
		</div>
	{/if}
{/if}
