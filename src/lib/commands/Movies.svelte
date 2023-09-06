<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { derived } from 'svelte/store';

	import {
		commandCtx,
		CommandGroup,
		CommandItem,
	} from '$components/ui/command2';
	import { Muted } from '$lib/components/ui/typography';
	import type { QueryOutput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import { getYear } from '$lib/utils/date';

	const {
		// options: { multiple },
		state: { inputValue, shouldFilter },
	} = commandCtx.get();

	const query = createQuery(
		derived(inputValue, ($value) => ({
			...queryFactory.search.movies({
				q: $value,
			}),
            enabled: $value.length > 1,
		})),
	);

	shouldFilter.set(false);

	export let onSelect: (movie: QueryOutput<"searchMovies">[number]) => void = (movie) => {};

</script>

<CommandGroup>
	{#if $query.isPending}
		Loading...
	{:else if $query.data}
		{#each $query.data as movie (movie.id)}
			<CommandItem
				value="{movie.title}"
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
