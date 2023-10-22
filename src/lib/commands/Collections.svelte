<script lang="ts">
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { Box, BoxIcon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { derived } from 'svelte/store';

	import CommandLoading from '$lib/components/ui/cmdk/Command.Loading.svelte';
	import {
		commandCtx,
		CommandGroup,
		CommandIcon,
		CommandItem,
	} from '$lib/components/ui/command2';
	import type { QueryOutput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import { icons } from '$components/icon-picker/data';
	import Skeleton from '$components/ui/skeleton/skeleton.svelte';

	const query = createInfiniteQuery(queryFactory.collections.list());

	// fetch all pages
	$: if ($query.hasNextPage && !$query.isFetchingNextPage) {
		$query.fetchNextPage();
	}

	const {
		state: { inputValue },
	} = commandCtx.get();

	const collections = derived(query, ($query) => {
		return $query.data?.pages.flatMap((page) => page.collections) ?? [];
	});

	// $q[0]

	export let onSelect = (
		collection: QueryOutput<'collections'>['collections'][number],
	) => {};
	export let create_fallback = false;
	export let onFallback: ((value: string) => void) | undefined = undefined;
	$: if (onFallback) {
		create_fallback = true;
	}

	const dispatch = createEventDispatcher<{
		create: string;
		select: QueryOutput<'collections'>['collections'][number];
	}>();
</script>

<!-- <CommandFallback>
	No collections found
</CommandFallback> -->
<CommandGroup>
	{#if $query.isPending}
		<CommandLoading class="flex grow flex-col gap-1">
			<div class="flex flex-col gap-2 p-2">
                {#each [1, 2, 3, 4, 5] as _}
                    <div class="flex gap-2 items-center">
                        <Skeleton class="w-5 h-5 shrink-0 rounded-full" />
                        <Skeleton class="grow h-9" />
                    </div>
                {/each}
            </div>
		</CommandLoading>
	{:else if $query.isSuccess}
		{#each $collections.filter((c) => c.name
				.toLowerCase()
				.includes($inputValue.toLowerCase())) as collection}
			<CommandItem
				onSelect={() => {
					dispatch('select', collection);
					onSelect(collection);
				}}
				value={`${collection.name} ${collection.id}`}
			>
				<!-- <Box class="mr-2 h-4 w-4" /> -->
				<svelte:component
					this={icons.find((icon) => icon.name === collection.icon)
						?.component ?? BoxIcon}
					data-color-hex={collection.color}
					class="mr-2 h-4 w-4"
					style="--color:{collection.color}"
				/>
				<!-- <CommandIcon /> -->
				<span>{collection.name}</span>
			</CommandItem>
		{:else}
			<div
				data-command-empty
				role="presentation"
				class="py-6 text-center text-sm"
			>
				<slot />
			</div>
		{/each}
		<!-- {#if create_fallback && search && !$query.data.some((c) => c.name === search)}
			<CommandItem
				onSelect={() => {
					dispatch('create', search);
					onFallback?.(search);
				}}
			>
				Create new collection: {search}
			</CommandItem>
		{/if} -->
	{/if}
</CommandGroup>
