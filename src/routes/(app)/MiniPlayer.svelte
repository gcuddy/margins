<script lang="ts">
	import Icon from "$lib/components/helpers/Icon.svelte";
	import { podcastPlayer } from "$lib/components/PodcastPlayer.svelte";
	import { name } from "$lib/icons";
	import { tweened } from "svelte/motion";
	import { crossfade, fly, scale } from "svelte/transition";

	export let expanded = true;

	const [send, receive] = crossfade({
		duration: 200,
		fallback: scale,
	});

	const height = tweened(52, {
		duration: 200,
	});

	$: if (expanded) {
		height.set(75);
	} else {
		height.set(52);
	}
</script>

<!-- href="/podcasts/{$podcastPlayer.podcast?.podcastIndexId}/{$podcastPlayer?.episode?.pIndexId}/" -->
<div
	on:mouseleave={() => (expanded = false)}
	style:height="{$height}px"
	on:mouseover={() => (expanded = true)}
	on:focus={() => (expanded = true)}
	class="group !mt-auto grid shrink-0 grid-rows-1 p-2 "
>
	<div class="rounded-lg bg-gray-800/80 p-2 dark:bg-black">
		{#if true}
			<div
				out:send|global={{
					key: "player",
				}}
				in:receive|global={{
					key: "player",
				}}
				class="relative  h-full w-full "
			>
				<div
					class="absolute flex w-full gap-1 truncate text-xs text-gray-500 {expanded
						? 'opacity-100'
						: 'opacity-0'}"
				>
					<span
						class=" top-0 w-full place-self-center truncate text-center  transition-opacity {expanded
							? 'opacity-100'
							: 'opacity-0'}">{$podcastPlayer.episode?.title}</span
					>
				</div>
				<div class="absolute bottom-0 flex w-full items-center justify-between">
					<div
						out:send|global={{
							key: "meta",
						}}
						class="relative flex h-5 w-5 select-none items-center overflow-hidden rounded "
					>
						<div class="absolute">
							<img draggable="false" alt="" src={$podcastPlayer.episode?.image} />
							<!-- <span class="absolute opacity-0">{$podcastPlayer.episode?.title}</span> -->
						</div>
					</div>

					<div class="flex items-center gap-2">
						<button class="flex items-center rounded p-[1px] hover:bg-gray-400/25">
							<Icon name="backwardMini" className="h-4 w-4 fill-gray-200" /></button
						>
						<button
							on:click={podcastPlayer.toggle}
							class="flex items-center rounded p-[1px] hover:bg-gray-400/25"
						>
							<Icon
								name={$podcastPlayer.paused ? "playMini" : "pauseMini"}
								className="h-4 w-4 fill-gray-200"
							/></button
						>
						<button class="flex items-center rounded p-[1px] hover:bg-gray-400/25">
							<Icon name="forwardMini" className="h-4 w-4 fill-gray-200" />
						</button>
					</div>
					<div class="flex h-5 w-5 items-center">
						<button class="flex items-center rounded p-[1px] hover:bg-gray-400/25">
							<Icon name="ellipsisHorizontalMini" className="h-4 w-4 fill-gray-200" />
						</button>
						<!-- <Icon name="" /> -->
					</div>
				</div>
			</div>
		{:else if expanded}
			<div
				out:send|global={{
					key: "player",
				}}
				in:receive|global={{
					key: "player",
				}}
				class="col-start-1 col-end-1 row-start-1 row-end-1 grid grid-rows-2"
			>
				<div class="flex min-w-0 items-center justify-between gap-2">
					<div class="relative flex min-w-0 flex-1 select-none items-center gap-1.5 truncate ">
						<img draggable="false" class="h-4 w-4 rounded" alt="" src={$podcastPlayer.episode?.image} />
						<span class="truncate text-xs opacity-100">{$podcastPlayer.episode?.title}</span>
					</div>
					<button class="flex items-center" on:click={podcastPlayer.clear}>
						<Icon name="xMarkMini" className="h-4 w-4 fill-gray-400" />
					</button>
				</div>
				<div class="flex justify-between">
					<div class="flex h-5 w-5 items-center">
						<button>o</button>
					</div>
					<div class="flex items-center gap-2">
						<button class="flex items-center rounded p-[1px] hover:bg-gray-400/25">
							<Icon name="backwardMini" className="h-4 w-4 fill-gray-200" /></button
						>
						<button
							on:click={podcastPlayer.toggle}
							class="flex items-center rounded p-[1px] hover:bg-gray-400/25"
						>
							<Icon
								name={$podcastPlayer.paused ? "playMini" : "pauseMini"}
								className="h-4 w-4 fill-gray-200"
							/></button
						>
						<button class="flex items-center rounded p-[1px] hover:bg-gray-400/25">
							<Icon name="forwardMini" className="h-4 w-4 fill-gray-200" />
						</button>
					</div>
					<div class="flex h-5 w-5 items-center">
						<button class="flex items-center rounded p-[1px] hover:bg-gray-400/25">
							<Icon name="ellipsisHorizontalMini" className="h-4 w-4 fill-gray-200" />
						</button>
						<!-- <Icon name="" /> -->
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
