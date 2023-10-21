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
        CommandEmpty
	} from '$components/ui/command2';
	import { Muted } from '$lib/components/ui/typography';
	import { effect } from '$lib/helpers';
	import type { QueryOutput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import { getYear } from '$lib/utils/date';
	import debounce from 'just-debounce-it';
	import { User2 } from 'lucide-svelte';
	import { Skeleton } from '$components/ui/skeleton';
	import { commandItemVariants } from '$components/ui/command2/style';

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
			...queryFactory.search.moviesMulti({
				q: $value,
			}),
			enabled: $value.length > 1,
		})),
	);

	export let isOpen = false;

	shouldFilter.set(false);

	export let onSelect: (
		media: QueryOutput<'searchMoviesMulti'>[number],
	) => void = (media) => {
		if (media.media_type === 'movie') {
			goto(`/movie/${media.id}`);
		} else if (media.media_type === 'tv') {
			goto(`/tv/${media.id}`);
		} else {
			goto(`/people/t${media.id}`);
		}
		isOpen = false;
	};
</script>

<CommandGroup>
	{#if  $query.isLoading || ($query.isFetching && !$query.data && $inputValue.length > 1)}
		<CommandLoading>

                <div class={commandItemVariants()}>
                    <Skeleton class="h-10 w-8 mr-4 rounded-md" />
                    <div class="flex flex-col grow gap-1">
                        <Skeleton class="h-3 w-full rounded-md" />
                        <Skeleton class="h-3 w-3/4 rounded-md" />
                    </div>
                </div>
                <div class={commandItemVariants()}>
                    <Skeleton class="h-10 w-8 mr-4 rounded-md" />
                    <div class="flex flex-col grow gap-1">
                        <Skeleton class="h-3 w-full rounded-md" />
                        <Skeleton class="h-3 w-3/4 rounded-md" />
                    </div>
                </div>
                <div class={commandItemVariants()}>
                    <Skeleton class="h-10 w-8 mr-4 rounded-md" />
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
			<EntryIcon type="movie" />
			<div class="flex flex-col justify-center items-center gap-1">
				<span class="font-semibold leading-none tracking-tight"
					>Search Movies & TV Shows</span
				>
				<span class="text-sm text-muted-foreground">Just start typing…</span>
			</div>
		</div>
	{:else if $query.data && $inputValue}
		{#each $query.data as media (media.id)}
			{#if media.media_type === 'movie'}
				{@const movie = media}
				<CommandItem
					value={movie.title}
					onSelect={() => {
						onSelect(movie);
					}}
				>
					<img
						src="https://image.tmdb.org/t/p/w92/{movie.poster_path}"
						class="mr-4 aspect-square h-10 w-8 shrink-0 rounded-md object-cover"
						alt=""
					/>
					<div class="flex flex-col">
						<span class="line-clamp-2 text-sm font-medium leading-tight"
							>{movie.title}</span
						>
						<Muted class="text-xs">{getYear(movie.release_date)}</Muted>
					</div>
				</CommandItem>
			{:else if media.media_type === 'tv'}
				{@const tv = media}
				<CommandItem
					value={tv.name}
					onSelect={() => {
						onSelect(tv);
					}}
				>
					<img
						src="https://image.tmdb.org/t/p/w92/{tv.poster_path}"
						class="mr-4 aspect-square h-10 w-8 shrink-0 rounded-md object-cover"
						alt=""
					/>
					<div class="flex flex-col">
						<span class="line-clamp-2 text-sm font-medium leading-tight"
							>{tv.name}</span
						>
						<Muted class="text-xs">{getYear(tv.first_air_date)}</Muted>
					</div>
				</CommandItem>
			{:else if media.media_type === 'person'}
				{@const person = media}
				<CommandItem
					value={person.name}
					onSelect={() => {
						onSelect(person);
					}}
				>
					{#if person.profile_path}
						<img
							src="https://image.tmdb.org/t/p/w185/{person.profile_path}"
							class="mr-4 aspect-square h-10 w-8 shrink-0 rounded-md object-cover"
							alt=""
						/>
					{:else}
						<div
							class="mr-4 aspect-square h-10 w-8 shrink-0 rounded-md object-cover bg-gray-500 flex items-center justify-center"
						>
							<User2 class="h-6 w-6 text-gray-100" />
						</div>
					{/if}
					<div class="flex flex-col">
						<span class="line-clamp-2 text-sm font-medium leading-tight"
							>{person.name}</span
						>
						<!-- <Muted class="text-xs">{getYear(tv.first_air_date)}</Muted> -->
					</div>
				</CommandItem>
			{/if}
		{:else}
        <CommandEmpty show>No results found.</CommandEmpty>
		{/each}
	{/if}
</CommandGroup>
