<script lang="ts">
	import { createTable, Subscribe, Render, createRender } from 'svelte-headless-table';
	import type { Note } from '$lib/queries/server';
	export let notes: Readable<Note[]>;

	import {
		addSortBy,
		addPagination,
		addTableFilter,
		addSelectedRows,
		addHiddenColumns,
		addColumnOrder
	} from 'svelte-headless-table/plugins';
	import { derived, type Readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import { IconPicker } from '$components/icon-picker';
	import Badge from '$components/ui/Badge.svelte';
	import { TagColorPill } from '$components/tags/tag-color';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import { cn } from '$lib';
	import BulkActions from './bulk-actions.svelte';
	import { Button } from '$components/ui/button';
	import { ArchiveIcon, ChevronDownIcon, ChevronUpIcon, CommandIcon, PinIcon } from 'lucide-svelte';
	import {
		initCreatePinMutation,
		initDeletePinMutation,
		updateAnnotationMutation
	} from '$lib/queries/mutations/index';
	import commandScore from 'command-score';

	const mutation = updateAnnotationMutation();

	const createPinMutation = initCreatePinMutation({
		invalidate: [['notes']]
	});
	const deletePinMutation = initDeletePinMutation({
		invalidate: [['notes']]
	});

	const pinMutating = derived(
		[createPinMutation, deletePinMutation],
		([$createPin, $deletePin]) => {
			return $createPin.isPending || $deletePin.isPending;
		}
	);

	const table = createTable(notes, {
		sort: addSortBy({
			disableMultiSort: true,
			initialSortKeys: [
				{
					id: 'createdAt',
					order: 'desc'
				}
			]
		}),
		select: addSelectedRows(),
		filter: addTableFilter({
			fn: ({ value, filterValue }) => {
				const score = commandScore(value, filterValue);
				return score > 0.05;
			}
		})
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: (_, { pluginStates }) => {
				const { allRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);
				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			header: 'Name',
			accessor: 'title'
		}),
		table.column({
			header: 'Updated',
			accessor: 'updatedAt',
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			header: 'Created',
			accessor: 'createdAt',
			plugins: {
				filter: {
					exclude: true
				}
			}
		})
	]);

	const { headerRows, rows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { sortKeys, preSortedRows } = pluginStates.sort;
	const { selectedDataIds, allRowsSelected, someRowsSelected } = pluginStates.select;
    const { filterValue } = pluginStates.filter;

	const selectedData = derived([selectedDataIds, rows], ([ids, rows]) => {
		const relevantRows = rows.filter((row) => ids[row.id]);
		return relevantRows
			.map((row) => {
				if (row.isData()) return row.original;
			})
			.filter(Boolean);
	});

	const allSelectedPinned = derived(selectedData, ($selectedData) => {
		// If all selected data.pin is truthy, return true
		// If all selected data.pin is falsy, return false
		// If some selected data.pin is truthy, return "indeterminate"
		const pins = $selectedData.map((data) => data.pin);
		if (pins.every(Boolean)) return true;
		if (pins.every((pin) => !pin)) return false;
		return 'indeterminate' as const;
	});
</script>

<div class="mb-4 flex items-center gap-4">
    <Input
</div>
<Table.Root {...$tableAttrs}>
	<Table.Header>
		{#each $headerRows as headerRow (headerRow.id)}
			<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
				<Table.Row {...rowAttrs}>
					{#each headerRow.cells as cell (cell.id)}
						<Subscribe cellAttrs={cell.attrs()} let:cellAttrs props={cell.props()} let:props>
							<Table.Head {...cellAttrs} class={cn('[&:has([role=checkbox])]:pl-3')}>
								{@const isSorted = $sortKeys.some((sortKey) => sortKey.id === cell.id)}
								<button
									data-sorted={isSorted}
									class="flex items-center gap-1 data-[sorted=true]:text-foreground"
									on:click={props.sort.toggle}
								>
									<Render of={cell.render()} />
									{#if props.sort.order === 'asc'}
										<ChevronUpIcon class="h-4 w-4" />
									{:else if props.sort.order === 'desc'}
										<ChevronDownIcon class="h-4 w-4" />
									{/if}
								</button>
							</Table.Head>
						</Subscribe>
					{/each}
				</Table.Row>
			</Subscribe>
		{/each}
	</Table.Header>
	<Table.Body {...$tableBodyAttrs}>
		{#each $rows as row (row.id)}
			<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
				<Table.Row {...rowAttrs}>
					{#each row.cells as cell (cell.id)}
						<Subscribe attrs={cell.attrs()} let:attrs>
							<Table.Cell {...attrs} class="[&:has([role=checkbox])]:pl-3">
								{#if cell.id === 'title' && row.isData()}
									{@const color = row.original.color ?? '#000'}
									{@const icon = row.original.icon ?? 'File'}
									<div class="flex items-center gap-x-1">
										<IconPicker
											variant="ghost"
											class="h-auto w-auto grow-0 shrink-0 basis-auto p-1.5"
											iconClass="h-4 w-4"
											activeColor={color}
											activeIcon={icon}
										/>
										<a href="/tests/note/{row.original.id}">
											<Render of={cell.render()} />
										</a>
										<div class="pl-2">
											{#each row.original.tags as tag (tag.id)}
												<Badge variant="secondary" as="a" href="/tests/tag/{tag.name}">
													<TagColorPill class="h-2 w-2 mr-1.5" color={tag.color} />
													{tag.name}
												</Badge>
											{/each}
										</div>
										<!-- {row.original.} -->
									</div>
								{:else}
									<Render of={cell.render()} />
								{/if}
							</Table.Cell>
						</Subscribe>
					{/each}
				</Table.Row>
			</Subscribe>
		{/each}
	</Table.Body>
</Table.Root>

<BulkActions length={Object.keys($selectedDataIds).length}>
	<Button
		variant="secondary"
		size="sm"
		on:click={() => {
			// TODO: confirm
			console.log({ $selectedDataIds, $rows });
			const rowsToUpdate = $rows.filter((row) => $selectedDataIds[row.id]);
			console.log({ rowsToUpdate });
			const ids = rowsToUpdate
				.map((row) => {
					if (row.isData()) {
						return row.original.id;
					}
				})
				.filter(Boolean);
			$mutation.mutate({
				id: ids,
				deleted: new Date()
			});
			selectedDataIds.clear();
		}}
	>
		<ArchiveIcon class="h-4 w-4 mr-2 text-muted-foreground" /> Archive</Button
	>
	{#if $allSelectedPinned !== 'indeterminate' && !$pinMutating}
		<Button
			variant="secondary"
			size="sm"
			on:click={() => {
				if ($allSelectedPinned) {
					// TODO: delete
					$deletePinMutation.mutate({
						// ideally data.pin.id should be inferred as nonnullable here
						id: $selectedData.map((data) => data.pin?.id ?? '')
					});
				} else {
					$createPinMutation.mutate(
						$selectedData.map((data) => ({
							annotationId: data.id
						}))
					);
				}
				selectedDataIds.clear();
			}}
		>
			<PinIcon class="h-4 w-4 mr-2 text-muted-foreground" />
			{$allSelectedPinned ? 'Remove from Pins' : 'Pin'}
		</Button>
	{/if}
	<Button variant="secondary" size="sm">
		<CommandIcon class="h-4 w-4 mr-2 text-muted-foreground" />
		More...</Button
	>
</BulkActions>
