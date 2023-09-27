<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import commandScore from 'command-score';
	import debounce from 'just-debounce-it';
	import { createEventDispatcher } from 'svelte';
	import { derived } from 'svelte/store';

	import { goto, preloadData } from '$app/navigation';
	// import TagColorPill from '$components/tags/tag-color/tag-color-pill.svelte';
	import {
		commandCtx,
		CommandGroup,
		CommandItem,
	} from '$components/ui/command2';
	import type { QueryOutput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';

	const query = createQuery(queryFactory.subscriptions.all());

	const {
		state: { activeValue, inputValue, shouldFilter },
	} = commandCtx.get();

	shouldFilter.set(false);

	export let isOpen = false;

	export let onSelect: (subscription: QueryOutput<'list_subscriptions'>[number]) => void = (subscription) => {
		void goto(`/tests/subscription/${subscription.feedId}`);
		isOpen = false;
	};

	export let preload = false;
	export let preloadDelay = 200;

	const dispatch = createEventDispatcher();

	const subscriptions = derived([query, inputValue], ([$query, $value]) => {
		const subscriptions = $query.data ?? [];
		if (!$value || $value.length < 2) {
			return subscriptions;
		}

		const scored = subscriptions.map((subscription) => ({
			...subscription,
			score: commandScore(subscription.title, $value),
		}));
		const sorted = scored.sort((a, b) => b.score - a.score);

		const filtered = sorted.filter((s) => s.score > 0);
		return filtered;
	});

	const debouncedPreload = debounce((url: string) => {
		preloadData(url);
	}, preloadDelay);

	$: if ($activeValue && preload) {
		debouncedPreload(`/tests/subscription/${$activeValue}`);
	}
</script>

<!-- <CommandLoading>Loading...</CommandLoading> -->

<CommandGroup>
	{#if $query.isPending}
		Loading...
	{:else}
		{#each $subscriptions.slice(0, 10) as subscription (subscription.id)}
			<CommandItem
				onSelect={() => {
					dispatch('select', subscription);
					onSelect(subscription);
				}}
			>
				<!-- <TagColorPill class="mr-4 h-2.5 w-2.5" color={tag.color} /> -->
				<span>{subscription.title}</span>
			</CommandItem>
		{:else}
			No results found.
		{/each}
	{/if}
</CommandGroup>
