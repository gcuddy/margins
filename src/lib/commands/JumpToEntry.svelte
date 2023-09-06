<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import commandScore from 'command-score';
	import { createEventDispatcher } from 'svelte';
	import { derived } from 'svelte/store';

	import { goto } from '$app/navigation';
	import {
		commandCtx,
		CommandGroup,
		CommandItem,
	} from '$components/ui/command2';
	import { Muted } from '$lib/components/ui/typography';
	import type { EntryInList } from '$lib/db/selects';
	import { queryFactory } from '$lib/queries/querykeys';
	import { getId } from '$lib/utils/entries';
	import EntryIcon from '$components/entries/EntryIcon.svelte';

	const entriesQuery = createQuery(queryFactory.entries.all());

	const {
		state: { inputValue, shouldFilter, selectedValue },
		options: { multiple },
	} = commandCtx.get();

	shouldFilter.set(false);

	export let isOpen = false;

	export let onSelect: (entry: EntryInList) => void = (entry) => {
		void goto(`/tests/${entry.type}/${getId(entry)}`);
		isOpen = false;
	};

	const dispatch = createEventDispatcher();

	const entries = derived(
		[entriesQuery, inputValue],
		([$entriesQuery, $value]) => {
            console.time('entries')
			const entries = $entriesQuery.data ?? [];
			console.log({ entries });
			if (!$value || $value.length < 2) {
                console.timeEnd('entries')
				return entries;
			}

			const scored = entries.map((entry) => ({
				...entry,
				score: commandScore(
					`${entry.title ?? ''} ${entry.author ?? ''}`,
					$value,
				),
			}));
			const sorted = scored.sort((a, b) => b.score - a.score);

			const filtered = sorted.filter((entry) => entry.score > 0);
            console.timeEnd('entries')
			return filtered;
		},
	);
</script>

<!-- <CommandLoading>Loading...</CommandLoading> -->

<CommandGroup>
	{#if $entriesQuery.isPending}
		Loading...
	{:else}
		{#each $entries.slice(0, 10) as entry (entry.id)}
			<CommandItem
				value="{entry.title} {entry.author}"
				onSelect={() => {
					dispatch('select', entry);
					onSelect(entry);
				}}
			>
				<!-- <img
					src={entry.image}
					class="mr-4 aspect-square h-10 w-10 shrink-0 rounded-md object-cover"
					alt=""
				/> -->
                <EntryIcon class="mr-4 h-4 w-4" type={entry.type} />
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
