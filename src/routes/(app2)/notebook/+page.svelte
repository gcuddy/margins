<script lang="ts">
	import { H1 } from '$lib/components/ui/typography';

	import Annotation from '$lib/components/notebook/Annotation.svelte';
	import type { PageData } from './$types';
	import Header from '$components/ui/Header.svelte';
	import * as Tabs from '$components/ui/tabs';
	import {
		createInfiniteQuery,
		keepPreviousData,
		useQueryClient,
	} from '@tanstack/svelte-query';
	import Table from './Table.svelte';
	import NotesTable from './notes-table.svelte';
	import { queryFactory } from '$lib/queries/querykeys';
	import { derived, writable } from 'svelte/store';
	import { Button } from '$components/ui/button';
	import { PlusIcon } from 'lucide-svelte';
	import Intersector from '$components/Intersector.svelte';
	import type { NotesInput } from '$lib/queries/server';
	import debounce from 'just-debounce-it';
	import { effect } from '$lib/helpers';
	import { persisted } from 'svelte-local-storage-store';

	let table: Table;
	let notesTable: NotesTable;

	export let data: PageData;

	const queryClient = useQueryClient();
	const input = writable<Omit<NotesInput, 'cursor'>>({});

	const value = persisted<'notes' | 'annotations'>('notebook-tab', 'notes');

	const search = writable('');

	const debouncedSearch = writable($search);

	const debouncedFn = debounce((val: string) => {
		debouncedSearch.set(val);
	}, 200);

	effect(search, ($search) => {
		if ($search) {
			debouncedFn($search);
		} else {
			debouncedSearch.set('');
		}
	});

	const notesQuery = createInfiniteQuery(
		derived(
			[input, value, debouncedSearch],
			([$input, $value, $debouncedSearch]) => ({
				...queryFactory.notes.list(
					{
						filter: {
							type: $value === 'notes' ? 'document' : undefined,
							content: $debouncedSearch ? $debouncedSearch : undefined,
							or:
								$value === 'annotations'
									? [{ type: 'annotation' }, { type: 'note' }]
									: undefined,
						},
						dir: 'desc',
						orderBy: 'createdAt',
						// ...$input
					},
					queryClient,
				),
				placeholderData: keepPreviousData,
			}),
		),
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
				}) ?? [],
	);
</script>

<Tabs.Root
	bind:value={$value}
	onValueChange={(val) => {
		if (val === 'annotations') {
			notesTable?.measure();
		} else {
			table?.measure();
		}
	}}
>
	<Header>
		<div class="flex items-center gap-3 flex-1 min-w-0">
			<slot name="title">
				<h1 class="font-bold text-base">Notebook</h1>
			</slot>
			<Tabs.List>
				<Tabs.Trigger value="notes">Notes</Tabs.Trigger>
				<Tabs.Trigger value="annotations">Annotations</Tabs.Trigger>
			</Tabs.List>
		</div>
		<svelte:fragment slot="end">
			<Button href="/notes/new" size="sm" variant="outline">
				<PlusIcon class="w-4 h-4 mr-2" />
				New Note
			</Button>
		</svelte:fragment>
	</Header>
	<div class="p-6 flex-1 flex flex-col space-y-8">
		<!-- <div>
        <h2 class="text-2xl font-bold tracking-tight">Notes</h2>
        <p class="text-muted-foreground"><span class="text-bold">Notes</span> is a place to write and connect notes.</p>
    </div> -->
		<Tabs.Content value="notes">
			{#if $notesQuery.isPending}
				loading..
			{:else if $notesQuery.isSuccess}
				<Table
					bind:this={table}
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
			<NotesTable
				loading={$notesQuery.isFetching && $search ? true : false}
                initialLoading={$notesQuery.isPending}
				{search}
				bind:this={notesTable}
				{input}
				notes={notesStore}
			/>
			<Intersector
				cb={() => {
					console.log('end intersecting');
					if ($notesQuery.hasNextPage && !$notesQuery.isFetchingNextPage) {
						console.log('fetching next page');
						$notesQuery.fetchNextPage();
					}
				}}
			/>
		</Tabs.Content>
	</div>
</Tabs.Root>
