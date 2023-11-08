<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import commandScore from 'command-score';
	import { createEventDispatcher, onDestroy } from 'svelte';
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
	import { cn } from '$lib';
	import { getElementIndex } from '$lib/helpers';

	const query = createQuery(queryFactory.tags.list());

	const {
		helpers: { changeShouldFilter },
		options: { onKeydown },
		state: { inputValue, shouldFilter, activeValue, activeElement },
	} = commandCtx.get();

	changeShouldFilter(false);

	export let isOpen = false;

	type Tag = QueryOutput<'tags'>[number];

	export let onSelect: (
		tag: Tag | undefined,
		selected: number[],
		indeterminate: number[],
		removed: number[],
	) => void = (tag) => {
		if (tag) void goto(`/tag/${tag.name}`);
		isOpen = false;
	};

	export let preload = false;
	export let preloadDelay = 200;

	export let multiple = false;

	export let selected: number[] = [];
	export let indeterminate: number[] = [];
	export let removed: number[] = [];

	let lastUtilizedSpaceIndex = -1;

	onKeydown.set((e) => {
		if (!$activeElement) return;
		const activeIdx = getElementIndex($activeElement);
		if (e.key === ' ' && (!$inputValue || activeIdx > 0)) {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			// toggle select
			const tag = $tags[activeIdx];
			if (!tag) return;
			if (selected.includes(tag.id)) {
				selected = selected.filter((id) => id !== tag.id);
				removed = Array.from(new Set([...removed, tag.id]));
			} else {
				selected = [...selected, tag.id];
			}
			lastUtilizedSpaceIndex = activeIdx;
		}
		if (e.key === 'Enter') {
			// check if we just used space to select a tag, if so close the menu but don't toggle selection
			if (lastUtilizedSpaceIndex === activeIdx) {
				e.preventDefault();
				onSelect($tags[activeIdx], selected, indeterminate, removed);
				isOpen = false;
			}
		}
	});

	onDestroy(() => {
		onKeydown.set(() => {});
	});

	const dispatch = createEventDispatcher();

	function sortFunction(a: Tag, b: Tag) {
		const selected1 = selected.includes(a.id) || indeterminate.includes(a.id);
		const selected2 = selected.includes(b.id) || indeterminate.includes(b.id);
		if ($shouldFilter || !$inputValue) {
			if (selected1 && selected2) {
				return 0;
			} else if (selected1) {
				return -1;
			} else if (selected2) {
				return 1;
			} else {
				return 0;
			}
		} else {
			// todo
			return 0;
		}
	}

	const tags = derived([query, inputValue], ([$query, $value]) => {
		const tags = [...($query.data ?? [])].sort(sortFunction);
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
		debouncedPreload(`/tag/${$activeValue}`);
	}
</script>

<!-- <CommandLoading>Loading...</CommandLoading> -->

<CommandGroup>
	{#if $query.isPending}
		Loading...
	{:else}
		{#each $tags.slice(0, 50) as tag (tag.id)}
			<CommandItem
				onSelect={() => {
					dispatch('select', tag);
					if (multiple) {
						if (selected.includes(tag.id)) {
							selected = selected.filter((id) => id !== tag.id);
							removed = Array.from(new Set([...removed, tag.id]));
						} else {
							selected = [...selected, tag.id];
						}
					}
					onSelect(tag, selected, indeterminate, removed);
				}}
				selected={selected.includes(tag.id)}
			>
				{#if multiple}
					<Checkbox
						on:click={(e) => {
							console.log('checkbox click');
							e.stopPropagation();
							e.preventDefault();
							e.stopImmediatePropagation();
							if (selected.includes(tag.id)) {
								selected = selected.filter((id) => id !== tag.id);
								removed = Array.from(new Set([...removed, tag.id]));
							} else {
								selected = [...selected, tag.id];
							}
						}}
						checked={selected.includes(tag.id)
							? true
							: indeterminate.includes(tag.id)
							? 'indeterminate'
							: false}
						class={cn(
							'mr-4 opacity-0 group-data-[highlighted]:opacity-100',
							(selected.includes(tag.id) || indeterminate.includes(tag.id)) &&
								'opacity-100',
						)}
					/>
				{/if}
				<TagColorPill class="mr-4 h-2.5 w-2.5" color={tag.color} />
				<span>{tag.name}</span>
			</CommandItem>
		{:else}
			No results found.
		{/each}
	{/if}
</CommandGroup>
