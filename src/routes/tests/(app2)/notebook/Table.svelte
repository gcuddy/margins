<script lang="ts">
	import { createTable, Subscribe, Render, createRender } from 'svelte-headless-table';
	import type { Note, NotesInput } from '$lib/queries/server';

	import {
		addSortBy,
		addPagination,
		addTableFilter,
		addSelectedRows,
		addHiddenColumns,
		addColumnOrder
	} from 'svelte-headless-table/plugins';
	import { derived, Writable, type Readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$components/ui/input';
	import { IconPicker } from '$components/icon-picker';
	import Badge from '$components/ui/Badge.svelte';
	import { TagColorPill } from '$components/tags/tag-color';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import { cn } from '$lib';
	import BulkActions from './bulk-actions.svelte';
	import { Button } from '$components/ui/button';
	import {
		ArchiveIcon,
		ChevronDownIcon,
		ChevronUpIcon,
		CommandIcon,
		PinIcon,
		SearchIcon
	} from 'lucide-svelte';
	import {
		initCreatePinMutation,
		initDeletePinMutation,
		updateAnnotationMutation
	} from '$lib/queries/mutations/index';
	import commandScore from 'command-score';
	import { create_multi } from '$components/entries/multi-select/multi';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import type { Snapshot } from '../../../$types';
	import { page } from '$app/stores';
	import { createEventDispatcher, tick } from 'svelte';
	import { createWindowVirtualizer, createVirtualizer } from '@tanstack/svelte-virtual';
	export let notes: Readable<Note[]>;

	export let input: Writable<NotesInput>;

	export let loading = false;

	type Sort = {
		orderBy: NotesInput['orderBy'];
		dir: NotesInput['dir'];
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
	const { selectedDataIds, allRowsSelected, someRowsSelected, getRowState } = pluginStates.select;
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

	const multi = create_multi({
		items: $notes.map((note) => note.id),
		allowedSelector: 'input',
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
			highlighted: $state.highlighted,
			_filterValue: $filterValue
		}),
		restore: ({ highlighted, _filterValue }) => {
			console.log(`restoring`, { highlighted, _filterValue });
			multi.helpers.setHighlighted(highlighted);
			$filterValue = _filterValue;
		}
	};

	type EphemeralState = {
		highlighted: string | null;
		_filterValue: string;
	};

	// my own capture and restore
	beforeNavigate(() => {
		const data: EphemeralState = {
			highlighted: $state.highlighted,
			_filterValue: $filterValue
		};
		sessionStorage.setItem($page.url.toString(), JSON.stringify(data));
	});
	afterNavigate(() => {
		const data = sessionStorage.getItem($page.url.toString());
		if (!data) return;
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
		overscan: 20,
		getItemKey: (index) => $rows[index]?.id ?? index
	});

	$: ({ measure } = $virtualizer);

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

	$: {
		$notes;
		console.log('measure');
		measure();
	}
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
