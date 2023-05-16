<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import smoothload from '$lib/actions/smoothload';
	import { useState } from '$lib/components/ui/cmdk/Command.Root.svelte';
	import { CommandGroup } from '$lib/components/ui/command';
	import CommandItem from '$lib/components/ui/command/CommandItem.svelte';
	import { Muted, Small } from '$lib/components/ui/typography';
	import type { EntryInList } from '$lib/db/selects';
	import { type QueryOutput, q } from '$lib/queries/query';
	import { getId, getType } from '$lib/utils/entries';
	import { createEventDispatcher, onDestroy } from 'svelte';

	const commander_state = useState();

	$: console.log({ $commander_state });
	$: console.log({ $$props });
	let value = '';

	export let isOpen = false;

	const unsubscribeState = commander_state.subscribe((state) => {
		value = state.search;
	});

	const client = q($page);

	let promise: Promise<QueryOutput<'searchNotes'>> = new Promise(() => {});

	export let onSelect: (note: QueryOutput<'searchNotes'>[number]) => void = (note) => {
		if (note.type === 'document') {
			goto(`/tests/${note.type}/${note.id}`);
		} else if (note.entry) {
			goto(`/tests/${getType(note.entry.type)}/${getId(note.entry)}#annotation-${note.id}`);
		}
		isOpen = false;
	};

	const dispatch = createEventDispatcher();

	let timer: number;
	const debounce = (value: string) => {
		clearTimeout(timer);
		timer = window.setTimeout(() => {
			promise = client.query('searchNotes', {
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
<CommandGroup>
	{#await value ? promise : [] then notes}
		{#each notes as note}
			<CommandItem
				value={note.id.toString()}
				onSelect={() => {
					onSelect(note);
				}}
			>
				<div class="flex flex-col gap-y-1">
					{#if note.entry?.id}
						<span class="flex items-center gap-x-3">
							<!-- <Avatar
						src={note.entry_image ||
							(annotation.entry_uri
								? `https://icon.horse/icon/${getHostname(annotation.entry_uri)}`
								: undefined)}
					>
						{annotation.entry_title?.match(/[A-z]/)?.[0]}
					</Avatar> -->
							<div class="flex grow justify-between gap-x-1">
								<div class="flex flex-col">
									<Small>{note.entry.title}</Small>
									<Muted class="text-xs">{note.entry.author}</Muted>
								</div>
								<Muted class="text-xs">
									{note.entry.type}
								</Muted>
							</div>
						</span>
					{/if}
					<div class="line-clamp-4">
						{#if note.type === 'annotation'}
							{#if note.exact}
								<p class="line-clamp-3 break-words px-2 text-base/5">
									<span
										class="rounded bg-yellow-400/25 px-0.5 dark:bg-yellow-300/80 dark:text-background"
									>
										{note.exact}
									</span>
								</p>
							{/if}
							{#if note.body}
								<div>
									{note.body}
								</div>
							{/if}
						{:else if note.type === 'note'}
							{note.body}
						{:else if note.type === 'document'}
							{note.title}
						{/if}
					</div>
				</div>
			</CommandItem>
		{/each}
	{/await}
</CommandGroup>
