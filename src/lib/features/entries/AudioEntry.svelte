<script lang="ts">
	import AnnotationModal from "$lib/components/annotations/AnnotationModal.svelte";
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Button from "$lib/components/Button.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import { podcastPlayer } from "$lib/components/PodcastPlayer.svelte";
	import { Card, CardContent, CardHeader } from "$lib/components/ui/card";
	import { modals } from "$lib/stores/modals";
	import type { Entry, Interaction } from "@prisma/client";
	import EpisodeListItem from "./EpisodeListItem.svelte";

	export let entry: {
		// {
		id: number;
		enclosureUrl: string | null;
		title: string | null;
		published?: string | Date | null;
		uri: string | null;
		author?: string | null;
		duration?: number | null;
		image: string | null;
		// }
		interactions: Interaction[];
	};
	console.log([entry]);
	$: interaction = entry.interactions?.[0];
</script>

<Card>
	<CardContent class="flex items-center gap-4">
		<img
			class="h-14 w-14 shrink-0 rounded object-cover"
			src={entry.image}
			alt=""
		/>
		<div class="flex flex-col text-sm">
			<span class="font-semibold">{entry.title}</span>
			{#if entry.author}<Muted>{entry.author}</Muted>{/if}
			{#if entry.duration}{entry.duration}{/if}
			{#if interaction?.progress}
				<Muted>{Math.round(interaction.progress * 100)}% completed</Muted>
			{/if}
		</div>
		<div class=" ml-auto flex flex-col items-center justify-center">
			<button
				on:click|preventDefault|stopPropagation={() => {
					if (!entry.enclosureUrl) return;
					if ($podcastPlayer.episode?.enclosureUrl === entry.enclosureUrl) {
						$podcastPlayer.paused = !$podcastPlayer.paused;
						return;
					}
					podcastPlayer.load(
						{
							title: entry.title || "",
							id: entry.id,
							enclosureUrl: entry.enclosureUrl,
							image: entry.image || "",
							entryId: entry.id,
						},
						{
							title: entry.author,
							// id: item.feed?.podcastIndexId,
						},
						interaction?.progress || undefined
					);
				}}
				class="flex flex-col items-center justify-center"
			>
				{#if $podcastPlayer.loaded && !$podcastPlayer.paused && $podcastPlayer.episode?.enclosureUrl === entry.enclosureUrl}
					<Icon name="pauseMini" className="h-4 w-4 fill-current" />
				{:else}
					<Icon name="playMini" className="h-4 w-4 fill-current" />
				{/if}
			</button>
		</div>
	</CardContent>
</Card>
<div class="flex items-center gap-4 bg-border/50 p-4">
	<img class="h-14 w-14 rounded object-cover" src={entry.image} alt="" />
	<div class="flex flex-col text-sm">
		<span class="font-semibold">{entry.title}</span>
		{#if entry.author}<Muted>{entry.author}</Muted>{/if}
		{#if entry.duration}{entry.duration}{/if}
		{#if interaction?.progress}
			<Muted>{Math.round(interaction.progress * 100)}% completed</Muted>
		{/if}
	</div>
	<div class=" ml-auto flex flex-col items-center justify-center">
		<button
			on:click|preventDefault|stopPropagation={() => {
				if (!entry.enclosureUrl) return;
				if ($podcastPlayer.episode?.enclosureUrl === entry.enclosureUrl) {
					$podcastPlayer.paused = !$podcastPlayer.paused;
					return;
				}
				podcastPlayer.load(
					{
						title: entry.title || "",
						id: entry.id,
						enclosureUrl: entry.enclosureUrl,
						image: entry.image || "",
						entryId: entry.id,
					},
					{
						title: entry.author,
						// id: item.feed?.podcastIndexId,
					},
					interaction?.progress || undefined
				);
			}}
			class="flex flex-col items-center justify-center"
		>
			{#if $podcastPlayer.loaded && !$podcastPlayer.paused && $podcastPlayer.episode?.enclosureUrl === entry.enclosureUrl}
				<Icon name="pauseMini" className="h-4 w-4 fill-current" />
			{:else}
				<Icon name="playMini" className="h-4 w-4 fill-current" />
			{/if}
		</button>
	</div>
</div>
<div class="mt-1 flex justify-end">
	<Button
		on:click={() => {
			modals.open(AnnotationModal, {
				timestamp: $podcastPlayer.currentTime
					? Math.floor($podcastPlayer.currentTime)
					: 0,
				entryId: $podcastPlayer.episode?.id,
				source: $podcastPlayer.episode?.enclosureUrl,
			});
		}}>Annotate</Button
	>
</div>

<!-- <EpisodeListItem item={entry} /> -->
