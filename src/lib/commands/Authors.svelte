<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import commandScore from 'command-score';
	import { createEventDispatcher } from 'svelte';
	import { derived } from 'svelte/store';

	import {
		commandCtx,
		CommandGroup,
		CommandItem,
	} from '$components/ui/command2';
	import type { QueryOutput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';

	const query = createQuery(queryFactory.entries.authors());

	const {
		state: { inputValue, shouldFilter },
	} = commandCtx.get();

	shouldFilter.set(false);

	export let isOpen = false;

	export let onSelect: (tag: QueryOutput<'get_authors'>[number]) => void = (tag) => {
		isOpen = false;
	};

	const dispatch = createEventDispatcher();

    const authors = derived([query, inputValue], ([$query, $value]) => {
        const authors = $query.data ?? [];

        if (!$value || $value.length < 1) {
            return [...authors].sort();
        }

        const scored = authors.map((author) => ({
            author,
            score: commandScore(author, $value),
        }));

        const sorted = scored.sort((a, b) => b.score - a.score);

        const filtered = sorted.filter((author) => author.score > 0);

        return filtered.map((author) => author.author);

    });
</script>

<!-- <CommandLoading>Loading...</CommandLoading> -->

<CommandGroup>
	{#if $query.isPending}
		Loading...
	{:else}
		{#each $authors.slice(0, 10) as author (author)}
			<CommandItem
				onSelect={() => {
					dispatch('select', author);
					onSelect(author);
				}}
			>
				<span>{author}</span>
			</CommandItem>
		{:else}
			No results found.
		{/each}
	{/if}
</CommandGroup>
