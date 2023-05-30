<script lang="ts">
	import { page } from '$app/stores';
	import CommandLoading from '$lib/components/ui/cmdk/Command.Loading.svelte';
	import { useState } from '$lib/components/ui/cmdk/Command.Root.svelte';
	import { CommandEmpty, CommandGroup } from '$lib/components/ui/command';
	import CommandFallback from '$lib/components/ui/command/CommandFallback.svelte';
	import CommandItem from '$lib/components/ui/command/CommandItem.svelte';
	import { queryKeys } from '$lib/queries/keys';
	import type { QueryOutput } from '$lib/queries/query';
	import { create_query } from '$lib/state/query-state';
	import { Box } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	import { query as qquery } from "$lib/queries/query"
	// const query = createQuery(queryKeys.collections.list($page));

	
	const query = create_query({
		key: 'collections',
		fn: async () => qquery($page, "collections", {}),
		stale_time: 1000
	})

	
	// $q[0]

	export let onSelect = (collection: QueryOutput<'collections'>[number]) => {
		console.log({ collection });
	};
	export let create_fallback = false;
	export let onFallback: ((value: string) => void) | undefined = undefined;
	$: if (onFallback) {
		create_fallback = true;
	}

	const dispatch = createEventDispatcher<{
		select: QueryOutput<'collections'>[number];
		create: string;
	}>();
</script>

<!-- <CommandFallback>
	No collections found
</CommandFallback> -->
<CommandGroup let:search>
	{#if $query.isLoading}
		<CommandLoading>Loading...</CommandLoading>
	{:else if $query.isSuccess}
		{#each $query.data.filter((c) => c.name
				.toLowerCase()
				.includes(search.toLowerCase())) as collection}
			<CommandItem
				onSelect={() => {
					dispatch('select', collection);
					onSelect(collection);
				}}
				value={collection.name + ' ' + collection.id}
			>
				<Box class="mr-2 h-4 w-4" />
				<span>{collection.name}</span>
			</CommandItem>
		{/each}
		{#if create_fallback && search && !$query.data.some((c) => c.name === search)}
			<CommandItem
				onSelect={() => {
					dispatch('create', search);
					onFallback?.(search)
				}}
			>
				Create new collection: {search}
			</CommandItem>
		{/if}
	{/if}
</CommandGroup>
