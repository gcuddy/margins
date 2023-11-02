<script lang="ts">
	import { get } from 'svelte/store';

	import EntryAnnotations from '../entry-annotations.svelte';

	import { commanderState } from '../../../routes/(app2)/Commander.svelte';

	import { createCopyCommands } from '../sub/sub-commands';

	import { PencilIcon } from 'lucide-svelte';

	import { Badge } from '$components/ui/badge';

	import { entryTypeIcon } from '$components/entries/icons';

	import { goto } from '$app/navigation';
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import { CommandItem } from '$components/ui/command2';
	import type { EntryType, Status } from '$lib/types/enums';
	import { createEventDispatcher } from 'svelte';
	import { getId, make_link, make_url } from '$lib/utils/entries';

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
		num_annotations?: string | number | null;
	}>;

	/** Optionally override the value*/
	export let value: string | undefined = undefined;

	export let entry: TEntry;

	export let open = true;

	export let onSelect: (entry: TEntry) => void = (entry) => {
		console.log('onSelect', entry);
		void goto(`/${entry.type}/${getId(entry)}`);
		open = false;
	};

	const dispatch = createEventDispatcher();

	import { Image } from '@unpic/svelte';
</script>

<CommandItem
	actions={[
		[
			{
				text: `Open ${entry.type}`,
				action: () => {
					goto(`/${entry.type}/${getId(entry)}`);
				},
				icon: entryTypeIcon[entry.type],
			},
			Number(entry.num_annotations)
				? {
						text: `See annotations`,
						action: () => {
                            commanderState.addPage({
                                component: EntryAnnotations,
                                props: {
                                    entryId: entry.id,
                                },
                            });
                            console.log(get(commanderState))
							return () => {
							};
							// return () => {};
							// TODO: Go to page with annotations
							// goto(`/${entry.type}/${getId(entry)}#annotations`);
						},
						icon: entryTypeIcon[entry.type],
				  }
				: undefined,
		].filter(Boolean),
		createCopyCommands({
			name: entry.title ?? '',
			externalUrl: make_url(entry) ?? '',
			deeplink: make_link(entry),
		}),
	]}
	label="{entry.title} {entry.author ?? ''}"
	value={value ?? entry ?? undefined}
	id={entry.id.toString()}
	title={entry.title ?? undefined}
	onSelect={() => {
		dispatch('select', entry);
		onSelect(entry);
	}}
	class="gap-4"
>
	<!-- TODO: better image optimziiations -->
	<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
		{#if entry.image}
			<Image
				class="h-full w-full rounded-[inherit] object-cover"
				src={entry.image}
				height={40}
				width={40}
				alt=""
			/>
		{:else}
			<EntryIcon type={entry.type} class="h-6 w-6" />
		{/if}
	</div>

	<div class="flex grow items-center justify-between">
		<div class="flex flex-col">
			<div class="flex items-center justify-between gap-4">
				<span class="line-clamp-2 text-sm">{entry.title}</span>
			</div>
			<span class="text-xs text-muted-foreground">{entry.author}</span>
		</div>
		<div class="flex">
			{#if Number(entry.num_annotations)}
				<Badge variant="secondary" class="h-min font-normal">
					<PencilIcon class="mr-1 !h-3 !w-3 shrink-0" />
					{entry.num_annotations}
				</Badge>
			{/if}
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
	</div>
</CommandItem>
