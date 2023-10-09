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
	import { Checkbox } from '$components/ui/checkbox';

	const query = createQuery(queryFactory.subscriptions.all());

	type Subscription = QueryOutput<'list_subscriptions'>[number];

	const {
		options: { multiple },
		state: { activeValue, inputValue, shouldFilter, selectedValue },
	} = commandCtx.get<Subscription>();

	$: console.log({ $selectedValue });

	shouldFilter.set(false);

	export let isOpen = false;

	export let onSelect: (subscription: Subscription) => void = (
		subscription,
	) => {
		void goto(`/tests/subscription/${subscription.feedId}`);
		isOpen = false;
	};

	export let preload = false;
	export let preloadDelay = 200;

	const dispatch = createEventDispatcher();

	const nameCompare = (a: Subscription, b: Subscription) => {
		return a.title.localeCompare(b.title);
	};

	// TODO: Sort selected to top
	function sortFunction(a: Subscription, b: Subscription) {
		if (!$selectedValue || $selectedValue.length < 1) {
			return nameCompare(a, b);
		}
        console.log({$selectedValue})
		const selected = $selectedValue.some((s) => s.value.id === a.id);
		const selected2 = $selectedValue.some((s) => s.value.id === b.id);
        console.log({ a,b, selected, selected2 })
		if ($shouldFilter || !$inputValue) {
			if (selected && selected2) {
				return nameCompare(a, b);
			} else if (selected) {
				return -1;
			} else if (selected2) {
				return 1;
			} else {
				return nameCompare(a, b);
			}
		} else {
			// todo
			return nameCompare(a, b);
		}
	}

	const subscriptions = derived([query, inputValue], ([$query, $value]) => {
		const subscriptions = $query.data ?? [];
		if (!$value || $value.length < 1) {
			return [...subscriptions].sort(sortFunction);
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
		{#each $subscriptions.slice(0, 100) as subscription (subscription.id)}
			<CommandItem
				onSelect={() => {
					dispatch('select', subscription);
					onSelect(subscription);
				}}
				let:isSelected
				value={subscription}
			>
				{#if multiple}
					<Checkbox class="mr-2" checked={isSelected} />
				{/if}
				<!-- <TagColorPill class="mr-4 h-2.5 w-2.5" color={tag.color} /> -->
				<span>{subscription.title}</span>
			</CommandItem>
		{:else}
			No results found.
		{/each}
	{/if}
</CommandGroup>
