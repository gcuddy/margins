<script lang="ts">
	export let films: Array<LetterboxdItem>;
	import { readable } from 'svelte/store';
	import {
		createRender,
		createTable,
		Render,
		Subscribe,
	} from 'svelte-headless-table';
	import { addSelectedRows } from 'svelte-headless-table/plugins';

	import { Button } from '$components/ui/button';
	import DataTableCheckbox from '$components/ui/data-table/data-table-checkbox.svelte';
	import * as Table from '$lib/components/ui/table';

	import type { LetterboxdItem } from './+page.server';
	import DataImage from './data-image.svelte';

	const table = createTable(readable(films), {
		select: addSelectedRows(),
	});

	const columns = table.createColumns([
		table.column({
			accessor: (item) => ({ title: item.title, year: item.year }),
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);
				return row.isData()
					? createRender(DataTableCheckbox, {
							checked: isSelected,
							name: 'id',
							value: row.dataId,
					  })
					: '';
			},
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected,
				});
			},
		}),
		table.column({
			accessor: 'image',
			cell: ({ row }) => {
				if (row.isData()) {
					row.isData();
					return createRender(DataImage, {
						src: row.original.image?.medium ?? '',
						title: row.original.title,
					});
				} else {
					return 'No image';
				}
			},
			header: 'Image',
		}),
		table.column({
			accessor: 'title',
			header: 'Name',
		}),
		table.column({
			accessor: 'year',
			header: 'Year',
		}),
	]);

	const {
		headerRows,
		pageRows,
		pluginStates,
		rows,
		tableAttrs,
		tableBodyAttrs,
	} = table.createViewModel(columns, {
		rowDataId: (item) => `${item.title}-${item.year}`,
	});

	const { selectedDataIds } = pluginStates.select;

	$: selectedLength = Object.keys($selectedDataIds).length;
</script>

<form>
	<div class="flex justify-between items-center mb-2">
		<div class="flex-1 text-sm text-muted-foreground">
			{selectedLength} of
			{$rows.length} rows selected.
		</div>
		<Button
			on:click={() => {
				// TODO - make this a form?
			}}
			disabled={!selectedLength}>Import {selectedLength} movies</Button
		>
	</div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
									<Table.Head {...attrs} class="[&:has([role=checkbox])]:pl-3">
										<Render of={cell.render()} />
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs} class="[&:has([role=checkbox])]:pl-3">
										<Render of={cell.render()} />
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</form>
