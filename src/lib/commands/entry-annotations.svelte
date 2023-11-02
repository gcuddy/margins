<script lang="ts">
	import { CommandGroup } from '$components/ui/command2';
	import { queryFactory } from '$lib/queries/querykeys';
	import { createQuery } from '@tanstack/svelte-query';
	import { derived, writable } from 'svelte/store';
	import NoteCommandItem from './items/note-command-item.svelte';

	export let entryId: number;
	export let enabled = writable(true);

	const entryIdStore = writable(entryId);

	$: entryIdStore.set(entryId);

	const query = createQuery(
		derived([entryIdStore, enabled], ([id, enabled]) => ({
			...queryFactory.entries.annotations({ id }),
			enabled,
		})),
	);

	// gets annotations for entries
</script>

{#if $query.isPending}
	Loading...
{:else if $query.error}
	An error has occured: {$query.error.message}
{:else}
	{@const notes = $query.data.filter((n) => n.type === 'note')}
	{@const annotations = $query.data.filter((n) => n.type === 'annotation')}
	{#if notes.length}
		<CommandGroup heading="Notes">
			{#each notes as note}
				<NoteCommandItem {note} showEntry={false} />
			{/each}
		</CommandGroup>
	{/if}
	{#if annotations.length}
		<CommandGroup heading="Annotations">
			{#each annotations as note}
				<NoteCommandItem {note} showEntry={false} />
			{/each}
		</CommandGroup>
	{/if}
{/if}
