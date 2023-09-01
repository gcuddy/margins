<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import commandScore from 'command-score';
	import { createEventDispatcher } from 'svelte';
	import { derived } from 'svelte/store';

	import { goto } from '$app/navigation';
	import { commandCtx, CommandGroup, CommandItem } from '$components/ui/command2';
	import smoothload from '$lib/actions/smoothload';
	import { Muted } from '$lib/components/ui/typography';
	import type { EntryInList } from '$lib/db/selects';
	import { queryFactory } from '$lib/queries/querykeys';
	import { getId } from '$lib/utils/entries';

	const entriesQuery = createQuery(queryFactory.entries.all());

	const {
		state: { inputValue },
	} = commandCtx.get();

	export let isOpen = false;

	export let onSelect: (entry: EntryInList) => void = (entry) => {
		void goto(`/tests/${entry.type}/${getId(entry)}`);
		isOpen = false;
	};

	const dispatch = createEventDispatcher();

	const entries = derived(
		[entriesQuery, inputValue],
		([$entriesQuery, $value]) => {
			const entries = $entriesQuery.data ?? [];
			if (!$value) return entries;

			const scored = entries.map((entry) => ({
				...entry,
				score: commandScore(
					$value,
					`${entry.title ?? ''} ${entry.author ?? ''}`,
				),
			}));

			const sorted = scored.sort((a, b) => b.score - a.score);

			return sorted.filter((entry) => entry.score > 0);
		},
	);
</script>

<!-- <CommandLoading>Loading...</CommandLoading> -->

<CommandGroup>
	{#if $entriesQuery.isPending}
		Loading...
	{:else}
		{#each $entries as entry}
			<CommandItem
				value={entry.id.toString()}
				onSelect={() => {
					dispatch('select', entry);
					onSelect(entry);
				}}
			>
				<img
					src={entry.image}
					class="mr-4 aspect-square h-10 w-10 shrink-0 rounded-md object-cover"
					alt=""
					use:smoothload
				/>
				<div class="flex flex-col">
					<span class="line-clamp-2 text-sm font-medium leading-tight"
						>{entry.title}</span
					>
					<Muted class="text-xs">{entry.type}</Muted>
				</div>
			</CommandItem>
		{:else}
			No results found.
		{/each}
	{/if}
</CommandGroup>
