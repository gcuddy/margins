<script lang="ts">
	import type { ListEntry } from '$lib/db/selects';
	import { relations_icons } from '$lib/features/relations/icons';
	import { objectMap } from '$lib/helpers';
	import { replace } from '$lib/helpers/string';
	import { queryFactory } from '$lib/queries/querykeys';
	import { get_image, make_link } from '$lib/utils/entries';
	import { createQuery } from '@tanstack/svelte-query';
	import { derived, writable } from 'svelte/store';

	export let entryId: number;
	export let enabled = writable(true);

	const entryIdStore = writable(entryId);

	$: entryIdStore.set(entryId);

	const query = createQuery(
		derived([entryIdStore, enabled], ([id, enabled]) => ({
			...queryFactory.entries.relations({ id }),
			enabled,
		})),
	);

	// because svelte doesn't allow generics, and because i can't figure out objectmap type magic
	const makeEntry = (data: any) => data as ListEntry;
</script>

{#if $query.isPending}
	Loading...
{:else if $query.error}
	<p class="text-destructive-foreground">
		{$query.error.message}
	</p>
{:else}
	{#each $query.data as relation}
		{@const entry = makeEntry(
			objectMap(relation, (key, value) => {
				if (!key.startsWith('entry_')) return undefined;
				return [replace(key, 'entry_', ''), value];
			}),
		)}
		<a
			href={make_link(entry)}
			class="flex cursor-pointer items-center gap-3 text-xs"
		>
			<svelte:component
				this={relations_icons[relation.relation_type]}
				class="h-3 w-3 shrink-0"
			/>
			<img
				src={get_image(entry)}
				class="aspect-square w-10 rounded-full object-cover"
                width={40}
                height={40}
				alt=""
			/>
			<span class="font-semibold line-clamp-2">{entry.title}</span>
		</a>
	{/each}
{/if}
