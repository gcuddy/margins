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

	const table = createTable(notes, {
		sort: addSortBy({
			disableMultiSort: true
		}),
		colOrder: addColumnOrder()
	});

	const columns = table.createColumns([
		table.column({
			header: 'Name',
			accessor: 'title',
			plugins: {
				sort: {
					invert: true
				}
			}
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

	$: console.log({ $rows });

	const { columnIdOrder } = pluginStates.colOrder;
	$columnIdOrder = ['title', 'updatedAt', 'createdAt'];
</script>

<Table.Root {...$tableAttrs}>
	<Table.Header>
		{#each $headerRows as headerRow (headerRow.id)}
			<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
				<Table.Row {...rowAttrs}>
					{#each headerRow.cells as cell (cell.id)}
						<Subscribe cellAttrs={cell.attrs()} let:cellAttrs props={cell.props()} let:props>
							<Table.Head {...cellAttrs}>
								<button on:click={props.sort.toggle}>
									<Render of={cell.render()} />
									{#if props.sort.order === 'asc'}
										down
									{:else}
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
							<Table.Cell {...attrs}>
								{#if cell.id === 'title' && row.isData()}
									{@const color = row.original.color ?? '#000'}
									{@const icon = row.original.icon ?? 'File'}
									<div class="flex items-center">
										<IconPicker
											variant="ghost"
											class="h-auto w-auto grow-0 shrink-0 basis-auto p-1.5"
											iconClass="h-4 w-4"
											activeColor={color}
											activeIcon={icon}
										/>
										<Render of={cell.render()} />
                                        {#each row.original.tags as tag (tag.id)}
                                            {tag.name}
                                        {/each}
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
