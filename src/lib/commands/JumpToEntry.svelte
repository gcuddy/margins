<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import commandScore from 'command-score';
	import debounce from 'just-debounce-it';
	import { createEventDispatcher, onMount } from 'svelte';
	import { derived } from 'svelte/store';

	import { goto, preloadData } from '$app/navigation';
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import {
		CommandGroup,
		CommandItem,
		commandCtx,
	} from '$components/ui/command2';
	import { Muted } from '$lib/components/ui/typography';
	import type { ListEntry } from '$lib/db/selects';
	import { queryFactory } from '$lib/queries/querykeys';
	import { recents } from '$lib/stores/recents';
	import { getId } from '$lib/utils/entries';
	import { page } from '$app/stores';

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

	const dispatch = createEventDispatcher();

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

	const debouncedPreload = debounce((url: string) => {
		preloadData(url);
	}, preloadDelay);

	// $: if ($activeOptionProps?.value && preload) {
	// 	const link = make_link($activeOptionProps.value);
	// 	debouncedPreload(link);
	// }
</script>

<!-- <CommandLoading>Loading...</CommandLoading> -->

<CommandGroup>
	{#if $entriesQuery.isPending}
		Loading...
	{:else}
		{#each $entries.slice(0, 10) as entry (entry.id)}
			<CommandItem
				label="{entry.title} {entry.author}"
				value={entry}
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
				<EntryIcon class="mr-4 h-4 w-4 shrink-0" type={entry.type} />
				<div class="flex justify-between items-center grow">
					<div class="flex flex-col">
						<span class="line-clamp-2 text-sm">{entry.title}</span>
						<Muted class="text-xs">{entry.author}</Muted>
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
		{:else}
			No results found.
		{/each}
	{/if}
</CommandGroup>
