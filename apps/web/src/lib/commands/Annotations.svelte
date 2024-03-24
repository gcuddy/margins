<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { derived } from 'svelte/store';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		commandCtx,
		CommandGroup,
		CommandItem,
	} from '$components/ui/command2';
	import smoothload from '$lib/actions/smoothload';
	import { useState } from '$lib/components/ui/cmdk/Command.Root.svelte';
	import { Muted, Small } from '$lib/components/ui/typography';
	import type { EntryInList } from '$lib/db/selects';
	import { q, type QueryOutput } from '$lib/queries/query';
	import { queryFactory } from '$lib/queries/querykeys';
	import { getId, getType } from '$lib/utils/entries';

	const {
		// options: { multiple },
        helpers: { changeShouldFilter },
		state: { inputValue, shouldFilter },
	} = commandCtx.get();

	changeShouldFilter(false);

	const query = createQuery(
		derived(inputValue, ($value) => ({
			...queryFactory.notes.search({
				q: $value,
			}),
		})),
	);

	export let onSelect: (note: QueryOutput<'searchNotes'>[number]) => void = (
		note,
	) => {
		if (note.type === 'document') {
			goto(`/note/${note.id}`);
		} else if (note.entry) {
			goto(
				`/${getType(note.entry.type)}/${getId(note.entry)}#annotation-${
					note.id
				}`,
			);
		}
	};
</script>

<CommandGroup>
	{#if $query.isPending}
		Loading...
	{:else if $query.data}
		{#each $query.data as note}
			<CommandItem
				value={note}
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
	{/if}
</CommandGroup>
