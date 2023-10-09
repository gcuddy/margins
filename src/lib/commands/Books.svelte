<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import debounce from 'just-debounce-it';
	import { derived, writable } from 'svelte/store';

	import { goto, preloadData } from '$app/navigation';
	import {
		commandCtx,
		CommandGroup,
		CommandItem,
	} from '$components/ui/command2';
	import type { QueryOutput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import { effect } from '$lib/helpers';

	const {
		state: { activeValue, inputValue, shouldFilter },
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

	shouldFilter.set(false);

	export let isOpen = false;

	export let onSelect: (tag: QueryOutput<'searchBooks'>[number]) => void = (
		book,
	) => {
		void goto(`/tests/book/${book.id}`);
		isOpen = false;
	};

	export let preload = false;
	export let preloadDelay = 200;

	const debouncedPreload = debounce((url: string) => {
		preloadData(url);
	}, preloadDelay);

	$: if ($activeValue && preload) {
		debouncedPreload(`/tests/book/${$activeValue}`);
	}
</script>

<!-- <CommandLoading>Loading...</CommandLoading> -->

<CommandGroup>
	{#if $inputValue}
		{#if $query.isPending}
			Loading...
		{:else if $query.data}
			{#each $query.data.slice(0, 10) as book (book.id)}
				<CommandItem
					onSelect={() => {
						onSelect(book);
					}}
				>
					<!-- <TagColorPill class="mr-4 h-2.5 w-2.5" color={tag.color} /> -->
					<img
						alt=""
						src={book.volumeInfo?.imageLinks?.thumbnail}
						class="mr-4 h-8 w-8 rounded object-cover"
					/>
					<div class="grow inline-flex gap-2 items-center">
						<span class="shrink-0">{book.volumeInfo?.title}</span>
						<div class="truncate shrink">
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
				No results found.
			{/each}
		{/if}
	{/if}
</CommandGroup>
