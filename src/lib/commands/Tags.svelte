<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import commandScore from 'command-score';
	import { createEventDispatcher } from 'svelte';
	import { derived } from 'svelte/store';

	import { goto, preloadData } from '$app/navigation';
	import TagColorPill from '$components/tags/tag-color/tag-color-pill.svelte';
	import {
		commandCtx,
		CommandGroup,
		CommandItem,
	} from '$components/ui/command2';
	import type { QueryOutput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import debounce from 'just-debounce-it';
	import Checkbox from '$components/ui/checkbox/checkbox.svelte';

	const query = createQuery(queryFactory.tags.list());

	const {
		state: { inputValue, shouldFilter, activeValue },
	} = commandCtx.get();

	shouldFilter.set(false);

	export let isOpen = false;

	export let onSelect: (tag: QueryOutput<'tags'>[number]) => void = (tag) => {
		void goto(`/tests/tag/${tag.name}`);
		isOpen = false;
	};

	export let preload = false;
	export let preloadDelay = 200;

	export let multiple = false;

	const dispatch = createEventDispatcher();

	const tags = derived([query, inputValue], ([$query, $value]) => {
		const tags = $query.data ?? [];
		if (!$value || $value.length < 2) {
			return tags;
		}

		const scored = tags.map((tag) => ({
			...tag,
			score: commandScore(tag.name, $value),
		}));
		const sorted = scored.sort((a, b) => b.score - a.score);

		const filtered = sorted.filter((tag) => tag.score > 0);
		return filtered;
	});

	const debouncedPreload = debounce((url: string) => {
		preloadData(url);
	}, preloadDelay);

	$: if ($activeValue && preload) {
		debouncedPreload(`/tests/tag/${$activeValue}`);
	}
</script>

<!-- <CommandLoading>Loading...</CommandLoading> -->

<CommandGroup>
	{#if $query.isPending}
		Loading...
	{:else}
		{#each $tags.slice(0, 10) as tag (tag.id)}
			<CommandItem
				onSelect={() => {
					dispatch('select', tag);
					onSelect(tag);
				}}
			>
				{#if multiple}
					<Checkbox class="mr-4 opacity-0 duration-75 transition-opacity group-data-[highlighted]:opacity-100" />
				{/if}
				<TagColorPill class="mr-4 h-2.5 w-2.5" color={tag.color} />
				<span>{tag.name}</span>
			</CommandItem>
		{:else}
			No results found.
		{/each}
	{/if}
</CommandGroup>
