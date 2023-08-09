import { dialogs } from '$components/ui/dialog2/store';
import { Writable, get, writable } from 'svelte/store';
import type { RequireAtLeastOne } from 'type-fest';

type State<T extends string | number> = {
	highlighted: T | null;
	items: T[];
	selected: Writable<T[]>;
	pivot: T | null;
};

// TODO data-id needs to be set on elements - can I do that in here?
// TODO allow bringing own store
export function create_multi<T extends string | number>({
	items,
	highlighted,
	pivot,
	selected
}: RequireAtLeastOne<Partial<State<T>>, 'items'>) {
	let root: HTMLElement | null = null;
	const selectedStore = selected ?? writable([]);
	const state = writable<State<T>>({
		highlighted: highlighted ?? null,
		items,
		selected: selectedStore,
		pivot: pivot ?? null
	});

	function listIncludesAndIsNotEmpty(items: T[], key: T) {
		return items.length > 0 && items.includes(key);
	}

	function select(item: T) {
		state.update(($state) => {
			if (!listIncludesAndIsNotEmpty($state.items, item)) {
				return $state;
			}
			$state.selected.set([item]);
			return {
				...$state,
				pivot: item,
				highlighted: item
			};
		});
	}

	function setHighlighted(item: T) {
		const next_el = root?.querySelector(`[data-id="${item}"]`);
		if (next_el instanceof HTMLElement) {
			next_el.scrollIntoView({ block: 'nearest' });
			next_el.focus();
		}
        state.update(($state) => {
            return {
                ...$state,
                highlighted: item
            };
        })
	}

	function toggleSelection(_item?: T) {
		state.update(($state) => {
			const item = _item ?? $state.highlighted;
			if (!item) {
				return $state;
			}
			if (!listIncludesAndIsNotEmpty($state.items, item)) {
				return $state;
			}

			$state.selected.update(($selected) => {
				if ($selected.includes(item)) {
					return $selected.filter((i) => i !== item);
				}
				return [...$selected, item];
			});

			// if ($state.selected.includes(item) && $state.selected.length === 1) {
			// 	return {
			// 		...$state,
			// 		selected: [],
			// 		pivot: null
			// 	};
			// }

			// const selected = $state.selected.includes(item)
			// 	? $state.selected.filter((i) => i !== item)
			// 	: [...$state.selected, item];
			return {
				...$state,
				pivot: item,
				highlighted: item
			};
		});
	}

	function deselectAll() {
		selectedStore.set([]);
	}

	function selectAdjacent(item: T) {
		state.update(($state) => {
			if (!listIncludesAndIsNotEmpty($state.items, item)) {
				return $state;
			}

			// if ($state.selected.length === 0) {
			// 	const n = $state.items.indexOf(item) + 1;
			// 	// todo
			// }

			if (!$state.pivot) {
				return $state;
			}

			const pivot_index = $state.items.indexOf($state.pivot);
			const selection_index = $state.items.indexOf(item);

			const [start, end] =
				pivot_index < selection_index
					? [pivot_index, selection_index]
					: [selection_index, pivot_index];

			selectedStore.set($state.items.slice(start, end + 1));

			return {
				...$state,
				pivot: item,
				highlighted: item
			};
		});
	}

	return {
		elements: {
			root: (node: HTMLElement) => {
				root = node;
			}
		},
		events: {
			keydown: (event: KeyboardEvent) => {
				// todo
				if (event.key === 'ArrowUp' || event.key === 'k') {
					// selectAdjacent();
					event.preventDefault();
					state.update(($state) => {
						const index = $state.highlighted ? $state.items.indexOf($state.highlighted) : -1;
						const next = $state.items[Math.max(0, index - 1)];
						const next_el = root?.querySelector(`[data-id="${next}"]`);
						if (next_el instanceof HTMLElement) {
							next_el.scrollIntoView({ block: 'nearest' });
							next_el.focus();
						}
						return {
							...$state,
							highlighted: next
						};
					});
				}
				if (event.key === 'ArrowDown' || event.key === 'j') {
					// TODO shift
					event.preventDefault();
					state.update(($state) => {
						const index = $state.highlighted ? $state.items.indexOf($state.highlighted) : -1;
						const next = $state.items[Math.min($state.items.length - 1, index + 1)];
						const next_el = root?.querySelector(`[data-id="${next}"]`);
						if (next_el instanceof HTMLElement) {
							next_el.scrollIntoView({ block: 'nearest' });
							next_el.focus();
						}
						return {
							...$state,
							highlighted: next
						};
					});
					// selectAdjacent();
				}
				if (event.key === 'x') {
					toggleSelection();
					// toggleSelection();
				}
				if (event.key === 'Escape') {
					const dialogs_present = get(dialogs).length > 0;
					if (dialogs_present) return;
					event.preventDefault();
					deselectAll();
				}
			},
			click: (event: MouseEvent) => {
				if (event.shiftKey) {
					// selectAdjacent();
				}
				if (event.ctrlKey || event.metaKey) {
					// toggleSelection();
				}
				// select();
			}
		},
		stores: {
			state,
			selected: selectedStore
		},
		helpers: {
			updateItems: (items: T[]) => {
				console.log('updateItems', items);
				state.update(($state) => {
					return {
						...$state,
						items
					};
				});
			},
			isSelected: (item: T) => {
				const selected = get(selectedStore);
				return selected.includes(item);
			},
			toggleSelection,
            setHighlighted
		}
	};
}
