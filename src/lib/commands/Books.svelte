<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import debounce from 'just-debounce-it';
	import { derived, writable } from 'svelte/store';

	import { goto, preloadData } from '$app/navigation';
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
		state: { activeValue, inputValue, loading, shouldFilter },
	} = commandCtx.get();

	const debouncedInputValue = writable($inputValue);

	const debouncedFn = debounce((val: string) => {
		debouncedInputValue.set(val);
	}, 400);

	effect(inputValue, ($inputValue) => debouncedFn($inputValue));
	// TODO: debouncing
	const query = createQuery(
		derived([debouncedInputValue], ([$value]) => ({
			...queryFactory.search.books({ q: $value }),
			enabled: $value.length > 1,
		})),
	);

	$: $loading = $inputValue ? $query.isPending || $query.isFetching : false;

	// $: console.log({$query})

	changeShouldFilter(false);

	export let isOpen = false;

	export let onSelect: (tag: QueryOutput<'searchBooks'>[number]) => void = (
		book,
	) => {
		void goto(`/book/${book.id}`);
		isOpen = false;
	};

	export let preload = false;
	export let preloadDelay = 200;

	const debouncedPreload = debounce((url: string) => {
		preloadData(url);
	}, preloadDelay);

	$: if ($activeValue && preload) {
		debouncedPreload(`/book/${$activeValue}`);
	}
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
			<EntryIcon type="book" />
			<div class="flex flex-col justify-center items-center gap-1">
				<span class="font-semibold leading-none tracking-tight"
					>Search Books</span
				>
				<span class="text-sm text-muted-foreground">Just start typing…</span>
			</div>
		</div>
	{:else if $query.data}
		{#each $query.data.slice(0, 10) as book (book.id)}
			<CommandItem
				onSelect={() => {
					onSelect(book);
				}}
			>
				<!-- <TagColorPill class="mr-4 h-2.5 w-2.5" color={tag.color} /> -->
                {#if book.volumeInfo?.imageLinks?.thumbnail}
				<img
					alt=""
					src={book.volumeInfo?.imageLinks?.thumbnail}
					class="mr-4 h-10 w-8 rounded object-cover"
				/>
                {:else}
                <div class="mr-4 h-10 w-8 rounded bg-gray-200"></div>

                {/if}
				<div class="grow flex flex-col gap-1 break-words overflow-hidden">
					<span class="shrink-0 line-clamp-2">{book.volumeInfo?.title}</span>
					<div class="truncate shrink flex gap-1 line-clamp-2">
						{#if book.volumeInfo?.authors}
							<span class="text-muted-foreground">
								{book.volumeInfo?.authors.join(', ')}
							</span>
						{/if}
						<!-- Year -->
						{#if book.volumeInfo?.publishedDate}
							<span class="text-muted-foreground">
								({book.volumeInfo?.publishedDate.slice(0, 4)})
								<!-- ({new Date(book.volumeInfo?.publishedDate).getYear()}) -->
							</span>
						{/if}
						<!-- Publisher -->
						<span class="text-muted-foreground">
							{book.volumeInfo?.publisher}
						</span>
					</div>
				</div>
			</CommandItem>
		{:else}
			<CommandEmpty show>No results found.</CommandEmpty>
		{/each}
	{/if}
</CommandGroup>
