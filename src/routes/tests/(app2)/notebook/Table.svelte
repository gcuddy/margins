<script lang="ts">
	import { createVirtualizer,createWindowVirtualizer } from '@tanstack/svelte-virtual';
	import commandScore from 'command-score';
	import {
		ArchiveIcon,
		ChevronDownIcon,
		ChevronUpIcon,
		CommandIcon,
		PinIcon,
		SearchIcon
	} from 'lucide-svelte';
	import { afterUpdate, createEventDispatcher, tick } from 'svelte';
	import { derived, type Readable,type Writable } from 'svelte/store';
	import { createRender,createTable, Render, Subscribe } from 'svelte-headless-table';
	import {
		addColumnOrder,
		addHiddenColumns,
		addPagination,
		addSelectedRows,
		addSortBy,
		addTableFilter	} from 'svelte-headless-table/plugins';

	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { create_multi } from '$components/entries/multi-select/multi';
	import { IconPicker } from '$components/icon-picker';
	import { TagColorPill } from '$components/tags/tag-color';
	import Badge from '$components/ui/Badge.svelte';
	import { Button } from '$components/ui/button';
	import { Input } from '$components/ui/input';
	import { cn } from '$lib';
	import * as Table from '$lib/components/ui/table';
	import {
		initCreatePinMutation,
		initDeletePinMutation,
		updateAnnotationMutation
	} from '$lib/queries/mutations/index';
	import type { Note, NotesInput } from '$lib/queries/server';

	import type { Snapshot } from '../../../$types';
	import BulkActions from './bulk-actions.svelte';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	export let notes: Readable<Array<Note>>;

	export let input: Writable<NotesInput>;

	export let loading = false;

	type Sort = {
		dir: NotesInput['dir'];
		orderBy: NotesInput['orderBy'];
	};
	export let onSort: ((sort: Sort) => void) | undefined = undefined;

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
		filter: addTableFilter({
			fn: ({ filterValue, value }) => {
				const score = commandScore(value, filterValue);
				return score > 0.05;
			}
		}),
		select: addSelectedRows(),
		sort: addSortBy({
			disableMultiSort: true,
			initialSortKeys: [
				{
					id: 'createdAt',
					order: 'desc'
				}
			]
		})
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);
				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			header: (_, { pluginStates }) => {
				const { allRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allRowsSelected
				});
			},
			plugins: {
				filter: {
					exclude: true
				},
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: 'title',
			header: 'Name'
		}),
		table.column({
			accessor: 'updatedAt',
			header: 'Updated',
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'createdAt',
			header: 'Created',
			plugins: {
				filter: {
					exclude: true
				}
			}
		})
	]);

	const { headerRows, pluginStates, rows, tableAttrs, tableBodyAttrs } =
		table.createViewModel(columns);

	const { preSortedRows, sortKeys } = pluginStates.sort;
	const { allRowsSelected, getRowState, selectedDataIds, someRowsSelected } = pluginStates.select;
	const { filterValue } = pluginStates.filter;

	const selectedData = derived([selectedDataIds, rows], ([ids, rows]) => {
		const relevantRows = rows.filter((row) => ids[row.id]);
		return relevantRows
			.map((row) => {
				if (row.isData()) {return row.original;}
			})
			.filter(Boolean);
	});

	const allSelectedPinned = derived(selectedData, ($selectedData) => {
		// If all selected data.pin is truthy, return true
		// If all selected data.pin is falsy, return false
		// If some selected data.pin is truthy, return "indeterminate"
		const pins = $selectedData.map((data) => data.pin);
		if (pins.every(Boolean)) {return true;}
		if (pins.every((pin) => !pin)) {return false;}
		return 'indeterminate' as const;
	});

	const multi = create_multi({
		allowedSelector: 'input',
		items: $notes.map((note) => note.id),
		onEnter(item) {
			const row = $rows.find((row) => row.id === item);
			if (row?.isData()) {
				goto(`/tests/note/${row.original.id}`);
			}
		},
		onSelect(item) {
			selectedDataIds.toggle(item);
		}
	});

	export const snapshot: Snapshot = {
		capture: () => ({
			_filterValue: $filterValue,
			highlighted: $state.highlighted
		}),
		restore: ({ _filterValue, highlighted }) => {
			console.log(`restoring`, { _filterValue, highlighted });
			multi.helpers.setHighlighted(highlighted);
			$filterValue = _filterValue;
		}
	};

	type EphemeralState = {
		_filterValue: string;
		highlighted: string | null;
	};

	// my own capture and restore
	beforeNavigate(() => {
		const data: EphemeralState = {
			_filterValue: $filterValue,
			highlighted: $state.highlighted
		};
		sessionStorage.setItem($page.url.toString(), JSON.stringify(data));
	});
	afterNavigate(() => {
		const data = sessionStorage.getItem($page.url.toString());
		if (!data) {return;}
		const parsed = JSON.parse(data) as EphemeralState;
		if (parsed) {
			multi.helpers.setHighlighted(parsed.highlighted);
			$filterValue = parsed._filterValue;
		}
	});
	let tbody: HTMLTableSectionElement;

	const virtualizer = createWindowVirtualizer({
		// getScrollElement: () => tbody ?? null,
		count: $rows.length,
		estimateSize: () => 60,
		getItemKey: (index) => $rows[index]?.id ?? index,
		overscan: 20
	});

	export const measure = () => $virtualizer?.measure();

	$: $virtualizer.setOptions({
		count: $rows.length
		// getScrollElement: () => tbody ?? null
	});

	const paddingTop = derived(virtualizer, ($virtualizer) => {
		const items = $virtualizer.getVirtualItems();
		return items.length > 0 ? items?.[0]?.start || 0 : 0;
	});
	const paddingBottom = derived(virtualizer, ($virtualizer) => {
		const virtualRows = $virtualizer.getVirtualItems();
		const totalSize = $virtualizer.getTotalSize();
		return virtualRows.length > 0
			? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
			: 0;
	});

	const {
		stores: { state }
	} = multi;

	$: console.log({ $state });

	$: multi.helpers.updateItems($rows.map((note) => note.id));

	let inputEl: HTMLInputElement;

	const getRow = (index: number) => {
		const row = $rows[index];
		if (!row) {
			throw new Error(`Row at index ${index} does not exist`);
		}
		return row;
	};

	export let onEnd = () => {};
	// $: {
	// 	const lastItem = $virtualizer.getVirtualItems().at(-1);
	// 	console.log({ lastItem, $notes });
	// 	if (lastItem && lastItem?.index >= $notes.length - 1) {
	// 		// console.log('fetching next page');
	// 		onEnd();
	// 	}
	// }
    // afterUpdate(() => {
    //     console.log('after update')
    //     measure();
    // })

	// $: {
	// 	$notes;
	// 	console.log('measure');
	// 	measure();
	// }
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'ArrowUp' && $state.highlighted) {
			const firstRow = $rows[0];
			if (firstRow?.id === $state.highlighted) {
				// put focus on input element
				inputEl?.focus();
				inputEl.setSelectionRange(1000, 1000);
				tick().then(() => {});
				multi.helpers.setHighlighted(null);
				return;
			}
		}
		multi.events.keydown(e);
	}}
/>

<div class="mb-4 flex items-center gap-4">
	<div class="relative">
		<Input
			bind:el={inputEl}
			class="max-w-sm text-sm pl-7"
			placeholder="Filter..."
			type="text"
			on:focus={() => {
				multi.helpers.setHighlighted(null);
			}}
			on:keydown={(e) => {
				if (e.key === 'ArrowDown') {
					if (e.target instanceof HTMLInputElement) {
						e.target.blur();
					}
				} else if (e.key === 'ArrowUp') {
					e.stopPropagation();
				}
			}}
			bind:value={$filterValue}
		/>
		<SearchIcon
			class="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50 peer-focus:opacity-100 transition-opacity"
		/>
	</div>
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
									on:click={(e) => {
										props.sort.toggle(e);
										$virtualizer.measure();
										props.sort.order;
										onSort?.({
											dir: props.sort.order,
											orderBy:
												cell.id === 'title'
													? 'name'
													: cell.id === 'createdAt'
													? 'createdAt'
													: cell.id === 'updatedAt'
													? 'updatedAt'
													: undefined
										});
									}}
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
	<Table.Body bind:el={tbody} {...$tableBodyAttrs}>
		{#if $paddingTop}
			<tr>
				<td style:height="{$paddingTop}px" />
			</tr>
		{/if}
		{#each $virtualizer.getVirtualItems() as item (item.key)}
			{@const row = getRow(item.index)}
			<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
				{@const highlighted = $state.highlighted === row.id}
				<Table.Row
					on:mouseover={multi.events.mouseover}
					{...rowAttrs}
					data-id={row.id}
					data-state={$selectedDataIds[row.id] && 'selected'}
					data-highlighted={highlighted}
					class="duration-100 data-[state=selected]:data-[highlighted=true]:bg-accent data-[highlighted=true]:ring-1 ring-inset"
				>
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
		{#if $paddingBottom}
			<tr>
				<td style:height="{$paddingBottom}px" />
			</tr>
		{/if}
	</Table.Body>
</Table.Root>

<BulkActions length={Object.keys($selectedDataIds).length}>
	<Button
		variant="secondary"
		size="sm"
		on:click={() => {
			// TODO: confirm
			console.log({ $rows, $selectedDataIds });
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
				deleted: new Date(),
				id: ids
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
