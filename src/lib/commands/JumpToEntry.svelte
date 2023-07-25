<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import smoothload from '$lib/actions/smoothload';
	import { useState } from '$lib/components/ui/cmdk/Command.Root.svelte';
	import { CommandGroup } from '$lib/components/ui/command';
	import CommandItem from '$lib/components/ui/command/CommandItem.svelte';
	import { Muted, } from '$lib/components/ui/typography';
	import type { EntryInList } from '$lib/db/selects';
	import { QueryOutput, q } from '$lib/queries/query';
	import { recents } from '$lib/stores/recents';
	import { getId } from '$lib/utils/entries';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	const loading = writable(false);

	let entries: EntryInList[] =
		(Array.isArray($page.data.entries) ? $page.data.entries : $page.data.entries?.entries) ?? [];

	const commander_state = useState();

	$: console.log({ $commander_state });
	$: console.log({ $$props });
	let value = '';
	export let isOpen = false;

	const unsubscribeState = commander_state.subscribe((state) => {
		value = state.search;
	});

	const client = q($page);

	let promise: Promise<QueryOutput<'search'>> = new Promise(() => {});

    $: console.log({promise})

	export let onSelect: (entry: EntryInList) => void = (entry) => {
		console.log({ entry, id: getId(entry) });
		goto(`/tests/${entry.type}/${getId(entry)}`);
		isOpen = false;
	};

	// $: if (value.length > 1)
	// 	promise = client.query('search', {
	// 		q: value
	// 	});

	const dispatch = createEventDispatcher();

	let timer: number;
	const debounce = (value: string) => {
		clearTimeout(timer);
		timer = window.setTimeout(() => {
			promise = client.query('search_titles', {
				q: value
			});
		}, 300);
	};

	$: if (value) debounce(value);

	onDestroy(() => {
		unsubscribeState();
	});
</script>

<!-- <CommandLoading>Loading...</CommandLoading> -->

{#await value ? promise : $recents.entries then entries}
	<CommandGroup>
		{#each entries as entry}
			<CommandItem
				value={entry.id.toString()}
				onSelect={() => {
					dispatch('select', entry);
					onSelect(entry);
				}}
			>
				<img
					src={entry.image}
					class="mr-4 aspect-square h-10 w-10 shrink-0 rounded-md object-cover"
					alt=""
					use:smoothload
				/>
				<div class="flex flex-col">
					<span class="line-clamp-2 text-sm font-medium leading-tight">{entry.title}</span>
					<Muted class="text-xs">{entry.type}</Muted>
				</div>
			</CommandItem>
        {:else}
            No results found.
		{/each}
	</CommandGroup>
{/await}
