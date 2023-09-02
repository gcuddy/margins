<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';

	import type { Queries } from '@/routes/tests/(app2)/queries.server';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import CommandLoading from '$lib/components/ui/cmdk/Command.Loading.svelte';
	import { useState } from '$lib/components/ui/cmdk/Command.Root.svelte';
	import { CommandGroup, CommandItem } from '$lib/components/ui/command';
	import { Muted, Small } from '$lib/components/ui/typography';
	import { q, type QueryOutput } from '$lib/queries/query';
	import { getYear } from '$lib/utils/date';
	import { getId, getType } from '$lib/utils/entries';
	import type { KeysThatBeginWith } from '$lib/utils/type-utils';

	const commander_state = useState();

	type SearchKeys = KeysThatBeginWith<Queries, 'media'>;

	export let type: 'searchMovies' = 'searchMovies';
	let value = '';

	export let isOpen = false;

	const unsubscribeState = commander_state.subscribe((state) => {
		value = state.search;
	});

	const client = q($page);

	let promise = new Promise<QueryOutput<'searchMovies'>>(() => {});

	export let onSelect: (item: QueryOutput<'searchMovies'>[number]) => void = (
		item,
	) => {
		if (item.media_type === 'movie') {
			goto(`/tests/movie/${item.id}`);
		} else if (item.media_type === 'tv') {
			goto(`/tests/tv/${item.id}`);
		} else if (item.media_type === 'person') {
			goto(`/tests/people/t${item.id}`);
		}
		isOpen = false;
	};

	const dispatch = createEventDispatcher();

	let timer: number;
	const debounce = (value: string) => {
		clearTimeout(timer);
		timer = window.setTimeout(() => {
			promise = client.query('searchMovies', { q: value });
		}, 300);
	};

	$: if (value) {
		debounce(value);
	}

	onDestroy(() => {
		unsubscribeState();
	});
</script>

<CommandGroup>
	{#await promise}
		<CommandLoading>Loading...</CommandLoading>
	{:then results}
		{#each results as item}
			<CommandItem
				value={item.id.toString()}
				onSelect={() => {
					onSelect(item);
				}}
			>
				{#if item.media_type === 'movie'}
					<div class="flex flex-col">
						<span
							><span class="font-medium">{item.title}</span> ({getYear(
								item.release_date,
							)})</span
						>
						<Muted class="text-xs">{item.media_type}</Muted>
					</div>
				{:else if item.media_type === 'tv'}
					<div class="flex flex-col">
						<span
							><span class="font-medium">{item.name}</span> ({getYear(
								item.first_air_date,
							)})</span
						>
						<Muted class="text-xs">{item.media_type}</Muted>
					</div>
				{:else if item.media_type === 'person'}
					<div class="flex flex-col">
						<span><span class="font-medium">{item.name}</span></span>
						<Muted class="text-xs">{item.media_type}</Muted>
					</div>
				{/if}
			</CommandItem>
		{/each}
	{/await}
</CommandGroup>
