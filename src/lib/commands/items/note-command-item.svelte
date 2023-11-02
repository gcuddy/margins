<script lang="ts">
	import { CommandItem } from '$components/ui/command2';
	import type { SearchNoteResult } from '$lib/db/queries/note';
	import { Icon } from '$components/icon-picker';
	import { Image } from '@unpic/svelte';
	import EntryIcon from '$components/entries/EntryIcon.svelte';

	export let note: SearchNoteResult;
    export let open = false;
    export let value: string | undefined = undefined;
</script>

{#if note.type === 'document'}
	<CommandItem {value}>
		<Icon icon={note.icon ?? "File"} color={note.color ?? "#000000"} class="mr-2 h-6 w-6 shrink-0" />
		{note.title}
		<!-- display title -->
	</CommandItem>
{:else if note.entry}
	<CommandItem {value} class="gap-4">
		<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
			{#if note.entry.image}
				<Image
					class="h-full w-full rounded-[inherit] object-cover"
					src={note.entry.image}
					height={40}
					width={40}
					alt=""
				/>
			{:else}
				<EntryIcon type={note.entry.type} class="h-6 w-6" />
			{/if}
		</div>

		<div class="flex flex-col gap-1">
			<div class="flex">
				<span class="font-semibold tracking-tighter">Note from:</span><span
					>{note.entry.title}</span
				>
			</div>
			<span class="line-clamp-2">{note.exact ?? note.body}</span>
		</div>
	</CommandItem>
{/if}
