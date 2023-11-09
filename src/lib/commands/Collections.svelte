<script lang="ts">
	import { createInfiniteQuery, useQueryClient } from '@tanstack/svelte-query';
	import { BoxIcon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { derived } from 'svelte/store';

	import { icons } from '$components/icon-picker/data';
	import Skeleton from '$components/ui/skeleton/skeleton.svelte';
	import CommandLoading from '$lib/components/ui/cmdk/Command.Loading.svelte';
	import {
		commandCtx,
		CommandGroup,
		CommandItem,
	} from '$lib/components/ui/command2';
	import { mutate, type QueryOutput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import commandScore from 'command-score';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import type { CollectionCreateInput } from '$lib/db/queries/collections';
	const query = createInfiniteQuery(queryFactory.collections.list());

    export let items: CollectionCreateInput["items"] | undefined = undefined;

	// fetch all pages
	$: if ($query.hasNextPage && !$query.isFetchingNextPage) {
		$query.fetchNextPage();
	}

    const queryClient = useQueryClient();
	const {
		helpers: { changeShouldFilter },
		state: { inputValue },
	} = commandCtx.get();

	changeShouldFilter(false);

	const collections = derived([query, inputValue], ([$query, $inputValue]) => {
		const _collections =
			$query.data?.pages.flatMap((page) => page.collections) ?? [];

		const _collectionsWithScore = _collections.map((collection) => ({
			...collection,
			score: commandScore(collection.name, $inputValue),
		}));

		return _collectionsWithScore
			.sort((a, b) => b.score - a.score)
			.filter((c) => c.score > 0);
	});

	// $q[0]

	export let onSelect = (
		collection: QueryOutput<'collections'>['collections'][number],
	) => {};
	export let create_fallback = false;
	export let onFallback: ((value: string) => void) | undefined = async (value) => {
		// console.log('create collection')
        try {
            dispatch('create', value);
            const { id } = await mutate('collectionCreate', {
                items,
                name: value,
            });

            queryClient.invalidateQueries({
                queryKey: ["collections"]
            })

            toast.success("Collection create", {
                description: value,
                action: {
                    label: "View collection",
                    onClick: () => {
                        goto(`/collection/${id}`)
                    }
                }
            })
        } catch(e) {
            console.error(e)
            toast.error("Error creating collection")
        }
	};
	$: if (onFallback) {
		create_fallback = true;
	}

	const dispatch = createEventDispatcher<{
		create: string;
		select: QueryOutput<'collections'>['collections'][number];
	}>();

	$: showFallback =
		create_fallback &&
		$inputValue.length > 2 &&
		!$collections.some((c) => c.name === $inputValue);
</script>

<!-- <CommandFallback>
	No collections found
</CommandFallback> -->
<CommandGroup>
	{#if $query.isPending}
		<CommandLoading class="flex grow flex-col gap-1">
			<div class="flex flex-col gap-2 p-2">
				{#each [1, 2, 3, 4, 5] as _}
					<div class="flex items-center gap-2">
						<Skeleton class="h-5 w-5 shrink-0 rounded-full" />
						<Skeleton class="h-9 grow" />
					</div>
				{/each}
			</div>
		</CommandLoading>
	{:else if $query.isSuccess}
		{#each $collections as collection (collection.id)}
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
			{#if !showFallback}
				<div
					data-command-empty
					role="presentation"
					class="py-6 text-center text-sm"
				>
					<slot />
				</div>
			{/if}
		{/each}
		{#if showFallback}
			<CommandItem
				onSelect={() => {
					onFallback?.($inputValue);
				}}
			>
				Create new collection: {$inputValue}
			</CommandItem>
		{/if}
	{/if}
</CommandGroup>
