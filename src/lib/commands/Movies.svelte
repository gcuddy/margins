<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { derived, writable } from 'svelte/store';

	import { goto } from '$app/navigation';
	import {
		commandCtx,
		CommandGroup,
		CommandItem,
		CommandEmpty,
	} from '$components/ui/command2';
	import { Muted } from '$lib/components/ui/typography';
	import type { QueryOutput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import { getYear } from '$lib/utils/date';
	import debounce from 'just-debounce-it';
	import { effect } from '$lib/helpers';
	import EntryIcon from '$components/entries/EntryIcon.svelte';

	const {
		// options: { multiple },
		state: { inputValue, shouldFilter },
	} = commandCtx.get();

	const debouncedInputValue = writable($inputValue);

	const debouncedFn = debounce((val: string) => {
		debouncedInputValue.set(val);
	}, 200);

	effect(inputValue, ($inputValue) => debouncedFn($inputValue));

	const query = createQuery(
		derived(debouncedInputValue, ($value) => ({
			...queryFactory.search.movies({
				q: $value,
			}),
			enabled: $value.length > 1,
		})),
	);

	createQuery({});

	export let isOpen = false;

	shouldFilter.set(false);

	export let onSelect: (movie: QueryOutput<'searchMovies'>[number]) => void = (
		movie,
	) => {
		goto(`/movie/${movie.id}`);
		isOpen = false;
	};
</script>

<CommandGroup>
	{#if $query.isLoading}
		Loading...
	{:else if $inputValue.length < 2 && !$query.data}
		<div class="flex p-8 w-full h-full flex-col items-center gap-4 justify-center">
            <EntryIcon type="movie" />
			<div class="flex flex-col justify-center items-center gap-1">
                <span class="font-semibold leading-none tracking-tight">Search Movies & TV Shows</span>
                            <span class="text-sm text-muted-foreground">Just start typing…</span>
            </div>
		</div>
	{:else if $query.data && $inputValue}
		{#each $query.data as movie (movie.id)}
			<CommandItem
				value={movie.title}
				onSelect={() => {
					onSelect(movie);
				}}
			>
				<img
					src="https://image.tmdb.org/t/p/w92/{movie.poster_path}"
					class="mr-4 aspect-square h-10 w-10 shrink-0 rounded-md object-cover"
					alt=""
				/>
				<div class="flex flex-col">
					<span class="line-clamp-2 text-sm font-medium leading-tight"
						>{movie.title}</span
					>
					<Muted class="text-xs">{getYear(movie.release_date)}</Muted>
				</div>
			</CommandItem>
		{:else}
			No results found.
		{/each}
	{/if}
</CommandGroup>
