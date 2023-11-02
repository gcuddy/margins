<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import commandScore from 'command-score';
	import { createEventDispatcher, onMount } from 'svelte';
	import { derived } from 'svelte/store';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		CommandGroup,
		commandCtx
	} from '$components/ui/command2';
	import type { ListEntry } from '$lib/db/selects';
	import { queryFactory } from '$lib/queries/querykeys';
	import { recents } from '$lib/stores/recents';
	import { getId } from '$lib/utils/entries';
	import EntryCommandItem from './items/entry-command-item.svelte';

	const entriesQuery = createQuery(derived(page, $page => ({...queryFactory.entries.all(), enabled: !!$page.data.user_data})));

	const {
		state: {
			inputValue,
			shouldFilter,
		},
	} = commandCtx.get<ListEntry>();

	let previousShouldFilterValue = $shouldFilter;

	onMount(() => {
		shouldFilter.set(false);
		return () => {
			shouldFilter.set(previousShouldFilterValue);
		};
	});

	export let isOpen = false;

	/**
	 * Optional list of entry ids to exclude from the list
	 */
	export let excludeIds: number[] = [];

	export let onSelect: (entry: ListEntry) => void = (entry) => {
		console.log('onSelect', entry);
		void goto(`/${entry.type}/${getId(entry)}`);
		isOpen = false;
	};

	export let preload = false;
	export let preloadDelay = 400;

	const filterExcluded = (entry: { id: number }) => {
		if (excludeIds.includes(entry.id)) return false;
		return true;
	};

	// sort Recents to top

	const entries = derived(
		[entriesQuery, inputValue, recents],
		([$entriesQuery, $value, $recents]) => {
			const entries = $entriesQuery.data ?? [];
			if (!$value) {
				// Show recents...
				return $recents.entries.filter(filterExcluded);
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

			// ensure no duplicate ids
			const ids = new Set();
			const deduped = filtered.filter((entry) => {
				if (ids.has(entry.id)) return false;
				ids.add(entry.id);
				return true;
			});
			return deduped.filter(filterExcluded);
		},
	);
</script>

<!-- <CommandLoading>Loading...</CommandLoading> -->

<CommandGroup>
	{#if $entriesQuery.isPending}
		Loading...
	{:else}
		{#each $entries.slice(0, 10) as entry (entry.id)}
            <EntryCommandItem {entry} on:select {onSelect} />
		{:else}
			No results found.
		{/each}
	{/if}
</CommandGroup>
