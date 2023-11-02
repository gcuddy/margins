<script lang="ts">

	import { goto } from '$app/navigation';
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import { CommandItem } from '$components/ui/command2';
	import type { EntryType, Status } from '$lib/types/enums';
    import { createEventDispatcher } from 'svelte';
	import { getId } from '$lib/utils/entries';

	type TEntry = $$Generic<{
		id: number;
		title: string | null;
		image?: string | null;
		author?: string | null;
		type: EntryType;
		status?: Status;
		progress?: number | null;
		googleBooksId?: string | null;
		podcastIndexId?: number | null;
		spotifyId?: string | null;
		tmdbId?: number | null;
	}>;

    /** Optionally override the value*/
    export let value: string | undefined = undefined;

	export let entry: TEntry;

    export let  open = true;

	export let onSelect: (entry: TEntry) => void = (entry) => {
		console.log('onSelect', entry);
		void goto(`/${entry.type}/${getId(entry)}`);
		open = false;
	};

    const dispatch = createEventDispatcher();

	import { Image } from '@unpic/svelte';


</script>

<CommandItem
	label="{entry.title} {entry.author ?? ''}"
	value={value ?? entry ?? undefined}
	id={entry.id.toString()}
	title={entry.title ?? undefined}
    onSelect={() => {
        dispatch('select', entry);
        onSelect(entry)
    }}
    class="gap-4"
>
	<!-- TODO: better image optimziiations -->
	<div class="shrink-0 h-8 w-8 rounded-md flex items-center justify-center">
		{#if entry.image}
			<Image class="h-full w-full rounded-[inherit] object-cover" src={entry.image} height={40} width={40} alt="" />
		{:else}
			<EntryIcon type={entry.type} class="h-6 w-6" />
		{/if}
	</div>

	<div class="flex grow items-center justify-between">
		<div class="flex flex-col">
			<span class="line-clamp-2 text-sm">{entry.title}</span>
			<span class="text-xs text-muted-foreground">{entry.author}</span>
		</div>
		<div class="flex flex-col text-right">
			{#if entry.status}
				<span class="text-xs text-muted-foreground">{entry.status}</span>
			{/if}
			{#if entry.progress}
				<span class="text-xs tabular-nums text-muted-foreground"
					>{Math.round(entry.progress * 100)}%</span
				>
			{/if}
		</div>
	</div>
</CommandItem>
