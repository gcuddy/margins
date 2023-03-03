<script lang="ts">
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import { podcastPlayer } from "$lib/components/PodcastPlayer.svelte";
	import dayjs from "$lib/dayjs";
	import type { Entry } from "@prisma/client";

	export let item: Entry & {
		feed: {
			title: string;
			imageUrl: string;
			podcastIndexId: number;
		};
	};

	const formatDuration = (seconds: number) => {
		const d = dayjs.duration(seconds, "seconds");

		return d.format(`${d.hours() > 0 ? "H[h]" : ""} ${d.minutes() > 0 ? "m[m]" : ""}`);
	};
</script>

<!-- TODO: make match up with everything else in entrylist -->

<li class="group flex gap-2 py-2">
	<div class="shrink-0">
		<button
			class="group/button relative h-20 w-20 rounded"
			on:click={() => {
				if (!item.enclosureUrl || !item.feedId) return;
				podcastPlayer.load(
					{
						title: item.title || "",
						id: item.id,
						enclosureUrl: item.enclosureUrl,
						image: item.image || item.feed?.imageUrl || "",
					},
					{
						title: item.feed?.title,
						// id: item.feed?.podcastIndexId,
					}
				);
			}}
		>
			<img
				class="absolute top-0 h-20 w-20 rounded-lg shadow"
				src={item.image || item.feed?.imageUrl}
				alt=""
			/>
			<Icon
				name="playCircle"
				className=" h-12 group-hover/button:fill-primary-400/95 group-hover:opacity-100 opacity-0 duration-200 transition w-12 stroke-black fill-gray-300/75 inset-0"
			/>
		</button>
	</div>
	<div class="flex flex-col space-y-1">
		<div class="flex space-x-2 text-xs font-medium uppercase tracking-tight">
			<Muted>{dayjs(item.published).format("l")}</Muted>
			{#if item.duration}
				<Muted>{formatDuration(item.duration)}</Muted>
			{/if}
		</div>
		<h2 class="font-semibold">
			<a href="/podcasts/{item.feed?.podcastIndexId}/{item.podcastIndexId}">{item.title}</a>
		</h2>
		<div class="max-h-20 overflow-hidden line-clamp-2">
			<Muted class="text-sm">{@html item.summary}</Muted>
		</div>
		<div class="flex cursor-default items-center space-x-1">
			<div class="flex flex-col items-center" />
			<div class="flex w-full items-center text-sm transition-[width]" />
		</div>
	</div>
</li>
