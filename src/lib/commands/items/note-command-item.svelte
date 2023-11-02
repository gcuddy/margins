<script lang="ts">
	import { CommandItem } from '$components/ui/command2';
	import type { SearchNoteResult } from '$lib/db/queries/note';
	import { Icon } from '$components/icon-picker';
	import { Image } from '@unpic/svelte';
	import { render_html } from '$components/ui/editor/utils';
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import { goto } from '$app/navigation';
	import { getId } from '$lib/utils/entries';
	import { createEventDispatcher } from 'svelte';
	import type { SetOptional } from 'type-fest';
	const dispatch = createEventDispatcher();

	export let note: SetOptional<SearchNoteResult, "entry">;
	export let open = false;
	export let value: string | undefined = undefined;
	export let showEntry = true;

	export let onSelect: (note: SearchNoteResult) => void = (entry) => {
		if (note.entry) {
			// go to note in entry
			goto(`/${note.entry.type}/${getId(note.entry)}#annotation-${note.id}`);
		} else {
			// then go to note directly
			goto(`/note/${note.id}`);
		}
		open = false;
	};
</script>

{#if note.type === 'document'}
	<CommandItem
		onSelect={() => {
			dispatch('select', note);
			onSelect(note);
		}}
		{value}
	>
		<Icon
			icon={note.icon ?? 'File'}
			color={note.color ?? '#000000'}
			class="mr-2 h-6 w-6 shrink-0"
		/>
		{note.title}
		<!-- display title -->
	</CommandItem>
{:else}
	<CommandItem
		onSelect={() => {
			dispatch('select', note);
			onSelect(note);
		}}
		{value}
		class="gap-4"
	>
		{#if note.entry && showEntry}
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
		{/if}

		<div class="flex min-w-0 flex-col gap-1">
			{#if note.entry?.title && showEntry}
				<div class="flex min-w-0 gap-1 truncate">
					<span
						class="shrink-0 font-medium tracking-tighter text-muted-foreground"
						>Entry</span
					><span class="font-semibold">{note.entry.title}</span>
				</div>
				<div class="flex min-w-0 gap-1 truncate">
					<span
						class="shrink-0 font-medium tracking-tighter text-muted-foreground"
						>Note</span
					><span class="font-semibold">{note.entry.title}</span>
				</div>
			{/if}
			{#if note.exact}
				<span class="line-clamp-2"><mark>{note.exact}</mark></span>
			{:else if note.body}
				<span class="line-clamp-2">{note.body}</span>
			{:else if note.contentData}
				<span class="line-clamp-2">{@html render_html(note.contentData)}</span>
			{/if}
		</div>
	</CommandItem>
{/if}
