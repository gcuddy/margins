<script lang="ts">
	import { writable } from 'svelte/store';

	import { page } from '$app/stores';
	import CommandLoading from '$lib/components/ui/cmdk/Command.Loading.svelte';
	import { CommandEmpty, CommandGroup } from '$lib/components/ui/command';
	import CommandItem from '$lib/components/ui/command/CommandItem.svelte';
	import type { FieldPath } from '$lib/queries/keys';
	import type { QueryOutput } from '$lib/queries/query';
	import {
		createQuery,
		useQueryClient,
		QueryKey,
		CreateQueryOptions,
		DefinedCreateQueryResult
	} from '@tanstack/svelte-query';
	import { Box } from 'lucide-svelte';
	import { ComponentType, createEventDispatcher } from 'svelte';

	const queryClient = useQueryClient();

	type TOutput = $$Generic<Array<Object>>;
	type TError = $$Generic;
	type TFnOutput = $$Generic<Array<Object>>;
	type TQueryKey = $$Generic<QueryKey>;

	export let opts: CreateQueryOptions<TOutput, TError, TFnOutput, TQueryKey> & {
		initialData?: undefined;
		queryKey: NonNullable<CreateQueryOptions['queryKey']>;
	};

	export let icon: ComponentType | undefined = undefined;
	export let iconClass = 'w-4 h-4 mr-2';
	
	// TODO: make  opts into a reactive store instead
	$: query = createQuery(opts);
	
	export let value: (item: TOutput[number]) => string;
	export let display = (item: TOutput[number]) => item.toString();
	export let image: ((item: TOutput[number]) => string) | undefined = undefined;
	// export let query: QueryKeys;

	export let onSelect = (item: TOutput[number]) => {};

	const dispatch = createEventDispatcher<{
		select: TOutput[number];
	}>();
</script>

{#if !$query.isLoading && !$query.data?.length}
	<CommandEmpty>No results found</CommandEmpty>
{/if}
<CommandGroup>
	{#if $query.isLoading}
		<CommandLoading>Loading...</CommandLoading>
	{:else if $query.isSuccess && $query.data.length}
		<slot data={$query.data} />
		{#each $query.data as item}
			<CommandItem
				onSelect={() => {
					dispatch('select', item);
					onSelect(item);
				}}
				value={value(item)}
			>
				<slot {item}>
					{#if icon}
						<svelte:component this={icon} class={iconClass} />
					{:else if image}
						<!-- image -->
						<img src={image(item)} class="mr-2 h-10 w-10" alt="" />
					{/if}
					{@html display(item)}
				</slot>
			</CommandItem>
		{/each}
	{/if}
</CommandGroup>
