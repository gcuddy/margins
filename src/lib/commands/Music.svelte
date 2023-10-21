<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { derived, writable } from 'svelte/store';

	import { goto } from '$app/navigation';
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import {
		CommandGroup,
		CommandItem,
		commandCtx,
		CommandLoading,
		CommandEmpty,
	} from '$components/ui/command2';
	import { Muted } from '$lib/components/ui/typography';
	import { effect } from '$lib/helpers';
	import type { QueryOutput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import { getYear } from '$lib/utils/date';
	import debounce from 'just-debounce-it';
	import { Skeleton } from '$components/ui/skeleton';
	import { commandItemVariants } from '$components/ui/command2/style';
	import { findClosestImage } from '$lib/utils';

	const {
		// options: { multiple },
		state: { inputValue, shouldFilter, loading },
	} = commandCtx.get();

	const debouncedInputValue = writable($inputValue);

	const debouncedFn = debounce((val: string) => {
		debouncedInputValue.set(val);
	}, 200);

	effect(inputValue, ($inputValue) => debouncedFn($inputValue));

    $: $loading = $inputValue ? $query.isPending || $query.isFetching : false;


	const query = createQuery(
		derived(debouncedInputValue, ($value) => ({
			...queryFactory.search.music({
				q: $value,
			}),
			enabled: $value.length > 1,
		})),
	);

	export let isOpen = false;

	shouldFilter.set(false);

	export let onSelect: (media: QueryOutput<'searchMusic'>[number]) => void = (
		media,
	) => {
		goto(`/album/${media.id}`);
		isOpen = false;
	};
</script>

<CommandGroup>
	{#if $query.isLoading || ($inputValue.length > 1 && !$query.data && !$query.error)}
		<CommandLoading>
			<div class={commandItemVariants()}>
				<Skeleton class="h-10 w-10 mr-4 rounded-md" />
				<div class="flex flex-col grow gap-1">
					<Skeleton class="h-3 w-full rounded-md" />
					<Skeleton class="h-3 w-3/4 rounded-md" />
				</div>
			</div>
			<div class={commandItemVariants()}>
				<Skeleton class="h-10 w-10 mr-4 rounded-md" />
				<div class="flex flex-col grow gap-1">
					<Skeleton class="h-3 w-full rounded-md" />
					<Skeleton class="h-3 w-3/4 rounded-md" />
				</div>
			</div>
			<div class={commandItemVariants()}>
				<Skeleton class="h-10 w-10 mr-4 rounded-md" />
				<div class="flex flex-col grow gap-1">
					<Skeleton class="h-3 w-full rounded-md" />
					<Skeleton class="h-3 w-3/4 rounded-md" />
				</div>
			</div>
		</CommandLoading>
	{:else if $inputValue.length < 2 && !$query.data}
		<div
			class="flex p-8 w-full h-full flex-col items-center gap-4 justify-center"
		>
			<EntryIcon type="album" />
			<div class="flex flex-col justify-center items-center gap-1">
				<span class="font-semibold leading-none tracking-tight"
					>Search for Music Albums</span
				>
				<span class="text-sm text-muted-foreground">Just start typing…</span>
			</div>
		</div>
	{:else if $query.data && $inputValue}
		{#each $query.data as album (album.id)}
			{@const img = findClosestImage(album.images, 100)}
			<CommandItem
				value={album.name}
				onSelect={() => {
					onSelect(album);
				}}
			>
            {#if img}
				<img
					src="{img.url}"
					class="mr-4 aspect-square h-10 w-10 shrink-0 rounded-md object-cover"
					alt=""
				/>
                {:else}
                <div class="mr-4 aspect-square h-10 w-10 shrink-0 rounded-md bg-gray-200"></div>
                {/if}
				<div class="flex flex-col">
					<span class="line-clamp-2 text-sm font-medium leading-tight"
						>{album.name}</span
					>
					<Muted class="text-xs">{getYear(album.release_date)}</Muted>
				</div>
			</CommandItem>
		{:else}
			<CommandEmpty show>No results found.</CommandEmpty>
		{/each}
	{/if}
</CommandGroup>
