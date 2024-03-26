<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import debounce from 'just-debounce-it';
	import { derived, writable } from 'svelte/store';

	import { goto } from '$app/navigation';
	import EntryIcon from '$components/entries/EntryIcon.svelte';

	import {
		commandCtx,
		CommandGroup,
		CommandItem,
		CommandEmpty,
		CommandLoading,
	} from '$components/ui/command2';
	import { commandItemVariants } from '$components/ui/command2/style';

	import { Skeleton } from '$components/ui/skeleton';

	import type { QueryOutput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import { effect } from '$lib/helpers';

	const {
        helpers: { changeShouldFilter },
		state: {  inputValue, loading, shouldFilter },
	} = commandCtx.get();

	const debouncedInputValue = writable($inputValue);

	const debouncedFn = debounce((val: string) => {
		debouncedInputValue.set(val);
	}, 400);

	effect(inputValue, ($inputValue) => debouncedFn($inputValue));
	// TODO: debouncing
	const query = createQuery(
		derived([debouncedInputValue], ([$value]) => ({
			...queryFactory.search.podcasts({ q: $value }),
			enabled: $value.length > 1,
		})),
	);

	$: $loading = $inputValue ? $query.isPending || $query.isFetching : false;

	// $: console.log({$query})

	changeShouldFilter(false);

	export let isOpen = false;

	export let onSelect: (podcast: QueryOutput<'searchPodcasts'>[number]) => void = (
		podcast,
	) => {
		void goto(`/show/p${podcast.id}`);
		isOpen = false;
	};

</script>

<!-- <CommandLoading>Loading...</CommandLoading> -->

<CommandGroup>
	{#if $query.isLoading}
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
	{:else if $inputValue.length < 2}
		<div
			class="flex p-8 w-full h-full flex-col items-center gap-4 justify-center"
		>
			<EntryIcon type="podcast" />
			<div class="flex flex-col justify-center items-center gap-1">
				<span class="font-semibold leading-none tracking-tight"
					>Search Podcasts</span
				>
				<span class="text-sm text-muted-foreground">Just start typing…</span>
			</div>
		</div>
	{:else if $query.data}
		{#each $query.data.slice(0, 25) as podcast (podcast.id)}
			<CommandItem
				onSelect={() => {
					onSelect(podcast);
				}}
			>
				<!-- <TagColorPill class="mr-4 h-2.5 w-2.5" color={tag.color} /> -->
                {#if podcast.artwork}
				<img
					alt=""
					src={podcast.artwork}
					class="mr-4 h-10 w-10 rounded object-cover"
				/>
                {:else}
                <div class="mr-4 h-10 w-10 rounded bg-gray-200"></div>

                {/if}
				<div class="grow flex flex-col gap-1 break-words overflow-hidden">
					<span class="shrink-0 line-clamp-2">{podcast.title}</span>
					<div class="truncate shrink flex gap-1 line-clamp-2">
						{#if podcast.author}
							<span class="text-muted-foreground">
								{podcast.author}
							</span>
						{/if}
					</div>
				</div>
			</CommandItem>
		{:else}
			<CommandEmpty show>No results found.</CommandEmpty>
		{/each}
	{/if}
</CommandGroup>
