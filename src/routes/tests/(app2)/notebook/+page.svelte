<script lang="ts">
	import { H1 } from '$lib/components/ui/typography';

	import Annotation from '$lib/components/notebook/Annotation.svelte';
	import type { PageData } from './$types';
	import Header from '$components/ui/Header.svelte';
	import * as Tabs from '$components/ui/tabs';
	import { createInfiniteQuery, keepPreviousData, useQueryClient } from '@tanstack/svelte-query';
	import Table from './Table.svelte';
	import { queryFactory } from '$lib/queries/querykeys';
	import { derived, writable } from 'svelte/store';
	import { Button } from '$components/ui/button';
	import { PlusIcon } from 'lucide-svelte';
	import Intersector from '$components/Intersector.svelte';
	import type { NotesInput } from '$lib/queries/server';

	export let data: PageData;

	const queryClient = useQueryClient();
	const input = writable<Omit<NotesInput, 'cursor'>>({});

	const notesQuery = createInfiniteQuery(
		derived(input, ($input) => ({
			...queryFactory.notes.list(
				{
					filter: {
						type: 'document'
					}
					// ...$input
				},
				queryClient
			),
			placeholderData: keepPreviousData
		}))
	);

	$: console.log({ $notesQuery });

	const notesStore = derived(
		notesQuery,
		($notesQuery) =>
			$notesQuery.data?.pages
				.flatMap((page) => page.notes)
				.filter((note) => {
					// match input best we can
					if (!$input.includeArchived) {
						if (!!note.deleted) return false;
					}
					return true;
				}) ?? []
	);
</script>

<Header>
	<H1>Annotations</H1>
	<svelte:fragment slot="end">
		<Button href="/tests/notes/new" size="sm" variant="secondary">
			<PlusIcon class="w-4 h-4 mr-2" />
			New Note
		</Button>
	</svelte:fragment>
</Header>

<Tabs.Root>
	<Tabs.List>
		<Tabs.Trigger value="notes">Notes</Tabs.Trigger>
		<Tabs.Trigger value="annotations">Annotations</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="notes">
		{#if $notesQuery.isPending}
			loading..
		{:else if $notesQuery.isSuccess}
			<Table
				{input}
				notes={notesStore}
				onSort={({ orderBy, dir }) => {
					// make sure all pages are fetched
					// $input = {
					// 	...$input,
					// 	orderBy,
					// 	dir
					// };
				}}
				onEnd={() => {
					console.log('end');
					if ($notesQuery.hasNextPage && !$notesQuery.isFetchingNextPage) {
						// $notesQuery.fetchNextPage();
					}
				}}
			/>
		{/if}
		<Intersector
			cb={() => {
				// if ($notesQuery.hasNextPage && !$notesQuery.isFetchingNextPage) {
				//     console.log('fetching next page')
				// 	$notesQuery.fetchNextPage();
				// }
			}}
		/>
	</Tabs.Content>
	<Tabs.Content value="annotations">
		<!-- {#each data.notes.notes as annotation (annotation.id)}
			<Annotation {annotation} />
		{/each} -->
	</Tabs.Content>
</Tabs.Root>
