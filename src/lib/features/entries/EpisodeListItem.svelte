<script lang="ts">
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import { podcastPlayer } from "$lib/components/PodcastPlayer.svelte";
	import dayjs from "$lib/dayjs";
	const formatDuration = (seconds: number) => {
		const d = dayjs.duration(seconds, "seconds");

		return d.format(`${d.hours() > 0 ? "H[h]" : ""} ${d.minutes() > 0 ? "m[m]" : ""}`);
	};
	import type { Entry, Interaction } from "@prisma/client";
	export let item: Entry & {
		feed?: {
			imageUrl: string | null;
			title: string | null;
			id: number;
			podcastIndexId: number | null;
		};
		interactions: Interaction[];
	};

	$: interaction = item.interactions?.[0];
</script>

<li class="group flex grow gap-2 py-2">
	<div class="shrink-0">
		<button
			class="group/button relative h-20 w-20 rounded"
			on:click|preventDefault|stopPropagation={() => {
				console.log("click", item);
				if (!item.enclosureUrl) return;
				podcastPlayer.load(
					{
						title: item.title || "",
						id: item.id,
						enclosureUrl: item.enclosureUrl,
						image: item.image || item.feed?.imageUrl || "",
						entryId: item.id,
					},
					{
						title: item.feed?.title,
						// id: item.feed?.podcastIndexId,
					},
					interaction?.progress || undefined
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
	<div class="flex grow flex-col space-y-1">
		<div class="flex space-x-2 text-xs font-medium uppercase tracking-tight">
			<Muted>{dayjs(item.published).format("l")}</Muted>
			{#if item.duration}
				<Muted>{formatDuration(item.duration)}</Muted>
			{/if}
		</div>
		<h2 class="font-semibold text-base">{item.title}</h2>
		<div class="max-h-20 overflow-hidden line-clamp-2">
			<Muted class="text-xs">{@html item.summary}</Muted>
		</div>
		<div class="flex cursor-default items-center space-x-1">
			<div class="flex flex-col items-center" />
			<div class="flex w-full items-center text-sm transition-[width]" />
		</div>
	</div>
</li>
