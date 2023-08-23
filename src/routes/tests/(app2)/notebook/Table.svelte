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
	import type { Readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import { IconPicker } from '$components/icon-picker';
	import Badge from '$components/ui/Badge.svelte';
	import { TagColorPill } from '$components/tags/tag-color';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import { cn } from '$lib';
	import BulkActions from './bulk-actions.svelte';
	import { Button } from '$components/ui/button';
	import { ArchiveIcon, CommandIcon, PinIcon } from 'lucide-svelte';

	const table = createTable(notes, {
		sort: addSortBy({
			disableMultiSort: true
		}),
		select: addSelectedRows()
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
				}
			}
		}),
		table.column({
			header: 'Name',
			accessor: 'title'
		}),
		table.column({
			header: 'Updated',
			accessor: 'updatedAt'
		}),
		table.column({
			header: 'Created',
			accessor: 'createdAt'
		})
	]);

	const { headerRows, rows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { sortKeys } = pluginStates.sort;

	const { selectedDataIds, allRowsSelected, someRowsSelected } = pluginStates.select;
</script>

<Table.Root {...$tableAttrs}>
	<Table.Header>
		{#each $headerRows as headerRow (headerRow.id)}
			<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
				<Table.Row {...rowAttrs}>
					{#each headerRow.cells as cell (cell.id)}
						<Subscribe cellAttrs={cell.attrs()} let:cellAttrs props={cell.props()} let:props>
							<Table.Head {...cellAttrs} class={cn('[&:has([role=checkbox])]:pl-3')}>
								<button on:click={props.sort.toggle}>
									<Render of={cell.render()} />
									{#if props.sort.order === 'asc'}
										down
									{:else if props.sort.order === 'desc'}
										up
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
	<Button variant="secondary" size="sm">
		<ArchiveIcon class="h-4 w-4 mr-2 text-muted-foreground" /> Archive</Button
	>
	<Button variant="secondary" size="sm">
		<PinIcon class="h-4 w-4 mr-2 text-muted-foreground" />
		Pin</Button
	>
	<Button variant="secondary" size="sm">
		<CommandIcon class="h-4 w-4 mr-2 text-muted-foreground" />
		More...</Button
	>
</BulkActions>
