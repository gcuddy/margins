<script lang="ts" context="module">
	export const LIST_SELECTOR = `[data-cmdk-list-sizer]`;
	export const GROUP_SELECTOR = `[data-cmdk-group]`;
	export const GROUP_ITEMS_SELECTOR = `[data-cmdk-group-items]`;
	export const GROUP_HEADING_SELECTOR = `[data-cmdk-group-heading]`;
	export const ITEM_SELECTOR = `[data-cmdk-item]`;
	export const VALID_ITEM_SELECTOR = `${ITEM_SELECTOR}:not([aria-disabled="true"])`;
	export const SELECT_EVENT = `cmdk-item-select`;
	export const VALUE_ATTR = `data-value`;

	type State = {
		search: string;
		value: string;
		active_id: string;
		selected: string | string[];
		filtered: {
			count: number;
			items: Map<string, number>;
			groups: Set<string>;
		};
	};

	type Context = {
		value: (id: string, value: string) => void;
		item: (id: string, groupId: string) => () => void;
		group: (id: string) => () => void;
		filter: () => boolean;
		label: string;
		// Ids
		listId: string;
		labelId: string;
		inputId: string;
		multiple: boolean;
	};

	export function useCommand() {
		const context = getContext<Readable<Context>>(`cmdk`);
		if (!context) {
			throw new Error(`Command must be used within a CommandProvider`);
		}
		return context;
	}

	function setCommandContext(context: Writable<Context>) {
		setContext(`cmdk`, context);
	}

	type StateStore = Writable<State> & {
		setState: <K extends keyof State>(key: K, value: State[K], opts?: any) => void;
		toggle: (value: string) => void;
		close: () => void;
	};

	export function useState() {
		const context = getContext<StateStore>(`cmdk_state`);
		if (!context) {
			throw new Error(`Command must be used within a CommandProvider`);
		}
		return context;
	}

	function setStateContext(context: StateStore) {
		setContext(`cmdk_state`, context);
	}
</script>

<script lang="ts">
	import { useId } from '$lib/hooks/use-id';
	// @ts-ignore
	import commandScore from 'command-score';
	import { createEventDispatcher, getContext, setContext, tick } from 'svelte';
	import type { HTMLBaseAttributes } from 'svelte/elements';
	import { writable, type Readable, type Writable } from 'svelte/store';

	let ref: HTMLElement | undefined = undefined;

	const defaultFilter: Required<CommandProps>['filter'] = (value, search) =>
		commandScore(value, search);

	function createStateStore(): StateStore {
		const store = writable<State>({
			/** Value of the search query. */
			search: '',
			active_id: '',
			/** Currently active item value. */
			value: '',
			/** Currently selected item */
			selected: multiple
				? selected && Array.isArray(selected)
					? selected
					: selected
					? [selected]
					: []
				: selected || '',
			filtered: {
				/** The count of all visible items. */
				count: 0,
				/** Map from visible item id to its search score. */
				items: new Map(),
				/** Set of groups with at least one visible item. */
				groups: new Set()
			}
		});

		return {
			...store,
			setState: (key, value, opts) => {
				store.update((state) => {
					if (Object.is(state[key], value)) return state;
					state[key] = value;
					console.log({ state });
					return state;
				});
				if (key === 'search') {
					console.log('search');
					filterItems();
					console.log('filtered items');
					sort();
					console.log('sorted');
					tick().then(() => {
						console.log('tick');
						selectFirstItem();
						// scrollSelectedIntoView();
						console.log('selected first');
					});
				} else if (key === 'value') {
					// opts is a boolean referring to whether it should NOT be scrolled into view
					if (!opts) {
						tick().then(() => scrollSelectedIntoView());
					}
				}
			},
			toggle: (value) => {
				console.log('toggle', value);
				store.update((state) => {
					if (Array.isArray(state.selected)) {
						if (state.selected.includes(value)) {
							state.selected = state.selected.filter((v) => v !== value);
							dispatch('remove', { value });
						} else {
							state.selected = [...state.selected, value];
							dispatch('add', { value });
						}
					} else {
						if (state.selected === value) {
							state.selected = '';
							dispatch('remove', { value });
						} else {
							state.selected = value;
							dispatch('add', { value });
						}
					}
					return state;
				});
			},
			close: () => dispatch('close')
		};
	}

	const allItems = writable<Set<string>>(new Set()); // [...itemIds]
	const allGroups = writable<Map<string, Set<string>>>(new Map()); // groupId → [...itemIds]
	const ids = writable<Map<string, string>>(new Map()); // id → value
	const listeners = writable<Set<() => void>>(new Set()); // [...rerenders]

	interface CommandProps extends HTMLBaseAttributes {
		/**
		 * Accessible label for this command menu. Not shown visibly.
		 */
		label?: string;
		/**
		 * Optionally set to `false` to turn off the automatic filtering and sorting.
		 * If `false`, you must conditionally render valid items based on the search query yourself.
		 */
		shouldFilter?: boolean;
		/**
		 * Custom filter function for whether each command menu item should matches the given search query.
		 * It should return a number between 0 and 1, with 1 being the best match and 0 being hidden entirely.
		 * By default, uses the `command-score` library.
		 */
		filter?: (value: string, search: string) => number;
		/**
		 * Optional controlled state of the selected command menu item.
		 */
		value?: string;
		/**
		 * Event htandler called when the selected item of the menu changes.
		 */
		onValueChange?: (value: string) => void;
		/**
		 * Optionally set to `true` to turn on looping around when using the arrow keys.
		 */
		loop?: boolean;
		/**
		 *  Event handler called when the user presses a key.
		 */
		onKeydown?: (event: KeyboardEvent) => void;
		/**
		 *  Optionally set to `true` to allow multiple items to be selected.
		 */
		multiple?: boolean;
		/**
		 *  Optionally provide previously selected items.
		 */
		selected?: string | string[];
		/**
		 *  Optionally provide a function to be called when the menu is empty.
		 */
		emptyAction?: () => void;
	}

	interface $$Props extends CommandProps {}
	export let label = '';
	export let shouldFilter = true;
	export let filter: $$Props['filter'] = undefined;
	export let value = '';
	export let onValueChange = (value: string) => {};
	export let loop = false;
	export let onKeydown: $$Props['onKeydown'] = undefined;
	export let multiple = false;
	export let selected: $$Props['selected'] = undefined;
	export let emptyAction: $$Props['emptyAction'] = undefined;

	// dispatcher for close event
	const dispatch = createEventDispatcher<{
		close: void;
		add: { value: string };
		remove: { value: string };
	}>();

	// $: $state.selected, dispatch("select", { value: $state.value });

	const state = createStateStore();

	setStateContext(state);

	// $: $state.value,
	// tick().then(() => ($state.active_id = getSelectedItem()?.id ?? ""));

	function score(value: string) {
		console.log(`scoring ${value}`);
		const filter = $propsRef.filter ?? defaultFilter;
		console.log({ filter });
		return value ? filter(value, $state.search) : 0;
	}

	/** Getters */

	function getSelectedItem() {
		return ref?.querySelector(`${ITEM_SELECTOR}[data-active="true"]`);
		// return ref?.querySelector(`${ITEM_SELECTOR}[aria-selected="true"]`);
	}

	function getValidItems() {
		return Array.from(ref?.querySelectorAll(VALID_ITEM_SELECTOR) ?? []);
	}

	/** Sorts items by score, and groups by highest item score. */
	function sort() {
		// Refactor this: this function is causing a lot of performance issues
		if (
			!ref ||
			$state.search ||
			// Explicitly false,    because true | undefined is the default
			$propsRef.shouldFilter === false
		) {
			return;
		}

		const scores = $state.filtered.items;

		// Sort the groups
		const groups: [string, number][] = [];
		$state.filtered.groups.forEach((value) => {
			const items = $allGroups.get(value);

			// Get the maximum score of the group's items
			let max = 0;
			items?.forEach((item) => {
				const score = scores.get(item);
				if (!score) return;
				max = Math.max(score, max);
			});
			groups.push([value, max]);
		});

		// Sort items within groups to bottom
		// Sort items outside of groups
		// Sort groups to bottom (pushes all non-grouped items to the top)
		const list = ref?.querySelector(LIST_SELECTOR);

		// Sort the items
		getValidItems()
			.sort((a, b) => {
				const valueA = a.getAttribute(VALUE_ATTR);
				const valueB = b.getAttribute(VALUE_ATTR);
				if (!valueA || !valueB) return 0;
				return (scores.get(valueB) ?? 0) - (scores.get(valueA) ?? 0);
			})
			.forEach((item) => {
				const group = item.closest(GROUP_ITEMS_SELECTOR);

				if (group && item) {
					item.parentElement;
					group.appendChild(
						item?.parentElement && item.parentElement === group
							? item
							: item.closest(`${GROUP_ITEMS_SELECTOR} > *`)!
					);
				} else {
					list?.appendChild(
						item.parentElement === list ? item : item.closest(`${GROUP_ITEMS_SELECTOR} > *`)!
					);
				}
			});

		groups
			.sort((a, b) => b[1] - a[1])
			.forEach((group) => {
				const element = ref?.querySelector(`${GROUP_SELECTOR}[${VALUE_ATTR}="${group[0]}"]`);
				element?.parentElement?.appendChild(element);
			});
	}

	/** Filters the current items. */
	function filterItems() {
		if (
			!$state.search ||
			// Explicitly false, because true | undefined is the default
			$propsRef.shouldFilter === false
		) {
			$state.filtered.count = $allItems.size;
			// Do nothing, each item will know to show itself because search is empty
			return;
		}

		console.log('Filtering items...');

		// Reset the groups
		$state.filtered.groups = new Set();
		let itemCount = 0;
		console.log({ $allItems });

		// Check which items should be included
		for (const id of $allItems) {
			const value = $ids.get(id);
			console.log({ value });
			if (!value) continue;
			const rank = score(value);
			console.log({ rank });
			$state.filtered.items.set(id, rank);
			if (rank > 0) itemCount++;
		}

		console.log({ $state });

		// Check which groups have at least 1 item shown
		for (const [groupId, group] of $allGroups) {
			for (const itemId of group) {
				if ($state.filtered.items.get(itemId) ?? 0 > 0) {
					$state.filtered.groups.add(groupId);
					break;
				}
			}
		}

		$state.filtered.count = itemCount;
	}

	function scrollSelectedIntoView() {
		const item = getSelectedItem();

		if (item) {
			if (item.parentElement?.firstChild === item) {
				// First item in Group, ensure heading is in view
				item
					.closest(GROUP_SELECTOR)
					?.querySelector(GROUP_HEADING_SELECTOR)
					?.scrollIntoView({ block: 'nearest' });
			}

			// Ensure the item is always in view
			item.scrollIntoView({ block: 'nearest' });
		}
	}

	function selectFirstItem() {
		const item = getValidItems().find((item) => !item.ariaDisabled);
		const value = item?.getAttribute(VALUE_ATTR);
		const id = item?.id;
		state.setState('value', value ?? '');
		state.setState('active_id', id ?? '');
	}

	const listId = useId().toString();
	const labelId = useId().toString();
	const inputId = useId().toString();

	const context = writable<Context>({
		listId,
		labelId,
		inputId,
		multiple,
		group: (id) => {
			if (!$allGroups.has(id)) {
				$allGroups.set(id, new Set());
			}
			return () => {
				$ids.delete(id);
				$allGroups.delete(id);
			};
		},
		filter: () => {
			return $propsRef.shouldFilter !== false;
		},
		label,
		value: (id, value) => {
			if (value !== $ids.get(id)) {
				$ids.set(id, value);
				$state.filtered.items.set(id, score(value));
				sort();
			}
		},
		// Track item lifecycle (mount, unmount)

		item: (id, groupId) => {
			console.time('item');
			$allItems.add(id);
			// Track this item within the group
			if (groupId) {
				if (!$allGroups.has(groupId)) {
					$allGroups.set(groupId, new Set([id]));
				} else {
					$allGroups.get(groupId)?.add(id);
				}
			}

			// Batch this, multiple items can mount in one pass
			// and we should not be filtering/sorting/emitting each time
			console.time('tick');
			filterItems();
			sort();

			// Could be initial mount, select the first item if none already selected
			if (!$state.value) {
				selectFirstItem();
			}
			console.timeEnd('tick');
			console.timeEnd('item');

			return () => {
				console.time('item remove');
				$ids.delete(id);
				$allItems.delete(id);
				$state.filtered.items.delete(id);
				// Batch this, multiple items could be removed in one pass
				tick().then(() => {
					console.time('tick remove');
					filterItems();
					// The item removed could have been the selected one,
					// so selection should be moved to the first
					selectFirstItem();
					console.timeEnd('tick remove');
				});
				console.timeEnd('item remove');
			};
		}
	});

	setCommandContext(context);

	const useScheduleLayoutEffect = () => {};

	const propsRef = writable<CommandProps>({
		label,
		shouldFilter,
		filter,
		value,
		onValueChange,
		loop
	});

	$: $propsRef = {
		label,
		shouldFilter,
		filter,
		value,
		onValueChange,
		loop
	};

	$: console.log({ $propsRef });

	/**
	 *
	 *
	 * Helpers
	 *
	 *
	 */

	function findNextSibling(el: Element, selector: string) {
		let sibling = el.nextElementSibling;

		while (sibling) {
			if (sibling.matches(selector)) return sibling;
			sibling = sibling.nextElementSibling;
		}
	}

	function findPreviousSibling(el: Element, selector: string) {
		let sibling = el.previousElementSibling;

		while (sibling) {
			if (sibling.matches(selector)) return sibling;
			sibling = sibling.previousElementSibling;
		}
	}

	/** Setters */

	function updateSelectedToIndex(index: number) {
		const items = getValidItems();
		const item = items[index];
		const attr = item?.getAttribute(VALUE_ATTR);
		if (attr) state.setState('value', attr);
		state.setState('active_id', item?.id ?? '');
	}

	function updateSelectedByChange(change: 1 | -1) {
		const selected = getSelectedItem();
		const items = getValidItems();
		const index = items.findIndex((item) => item === selected);
		console.log(`updateSelectedByChange`, { selected, items, index, change });

		// Get item at this index
		let newSelected = items[index + change];

		if ($propsRef?.loop) {
			newSelected =
				index + change < 0
					? items[items.length - 1]
					: index + change === items.length
					? items[0]
					: items[index + change];
		}

		if (newSelected) {
			state.setState('value', newSelected.getAttribute(VALUE_ATTR)!);
			state.setState('active_id', newSelected.id);
		}
	}

	function updateSelectedToGroup(change: 1 | -1) {
		const selected = getSelectedItem();
		let group = selected?.closest(GROUP_SELECTOR);
		let item: HTMLElement | null | undefined = null;

		while (group && !item) {
			group =
				change > 0
					? findNextSibling(group, GROUP_SELECTOR)
					: findPreviousSibling(group, GROUP_SELECTOR);
			item = group?.querySelector(VALID_ITEM_SELECTOR);
		}

		const attr = item?.getAttribute(VALUE_ATTR);
		state.setState('active_id', item?.id ?? '');
		if (attr) {
			state.setState('value', attr);
		} else {
			updateSelectedByChange(change);
		}
	}

	const last = () => updateSelectedToIndex(getValidItems().length - 1);

	const next = (e: KeyboardEvent) => {
		console.log('next', e);
		e.preventDefault();

		if (e.metaKey) {
			// Last item
			last();
		} else if (e.altKey) {
			// Next group
			updateSelectedToGroup(1);
		} else {
			// Next item
			console.log('next item');
			updateSelectedByChange(1);
		}
	};

	const prev = (e: KeyboardEvent) => {
		e.preventDefault();

		if (e.metaKey) {
			// First item
			updateSelectedToIndex(0);
		} else if (e.altKey) {
			// Previous group
			updateSelectedToGroup(-1);
		} else {
			// Previous item
			updateSelectedByChange(-1);
		}
	};
</script>

<div
	bind:this={ref}
	{...$$restProps}
	data-cmdk-root
	on:keydown={(e) => {
		onKeydown?.(e);
		if (!e.defaultPrevented) {
			switch (e.key) {
				case 'n':
				case 'j': {
					console.log('j');
					// vim keybind down
					if (e.ctrlKey) {
						console.log('ctrl+j');
						next(e);
					}
					break;
				}
				case 'ArrowDown': {
					next(e);
					break;
				}
				case 'p':
				case 'k': {
					// vim keybind up
					if (e.ctrlKey) {
						prev(e);
					}
					break;
				}
				case 'ArrowUp': {
					prev(e);
					break;
				}
				case 'Home': {
					// First item
					e.preventDefault();
					updateSelectedToIndex(0);
					break;
				}
				case 'End': {
					// Last item
					e.preventDefault();
					last();
					break;
				}
				case 'Enter': {
					// Trigger item onSelect
					e.preventDefault();
					const item = getSelectedItem();
					if (item) {
						const event = new Event(SELECT_EVENT);
						item.dispatchEvent(event);
					} else {
						const button = ref?.querySelector('[data-cmdk-empty] button');
						if (button && button instanceof HTMLButtonElement) {
							button.click();
						}
						emptyAction?.();
					}
					dispatch('close');
					break;
				}
				case ' ': {
					// Trigger item onSelect
					if (multiple) {
						e.preventDefault();
						const item = getSelectedItem();
						if (item) {
							const event = new Event(SELECT_EVENT);
							item.dispatchEvent(event);
						}
					}
					break;
				}
			}
		}
	}}
>
	<label class="sr-only" data-cmdk-label for={$context.inputId} id={$context.labelId}>
		{label}
	</label>
	<slot selected={$state.selected} />
	<!-- Context -->
</div>
