import { get, type Writable, writable } from 'svelte/store';
import type { RequireAtLeastOne } from 'type-fest';

import { checkIfKeyboardEventsAllowed as global_checkIfKeyboardEventsAllowed } from '$lib/helpers';


type State<T extends string | number> = {
	highlighted: T | null;
	items: Array<T>;
	pivot: T | null;
	selected: Writable<Array<T>>;
};

function modifier_keys_pressed(event: KeyboardEvent) {
	return event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
}

type AdditionalProps<T extends string | number> = {
	/**
	 * Css selector that won't cancel the keyboard arrow kys navigating.
	 */
	allowedSelector?: string;
	// The attribute to use to find elements in the DOM. Default to data-id.
	attribute?: string;
	onEnter?: (item: T) => void;

	/**
	 * Allows you to overwrite the default toggleSelection function.
	 * @param item - The item to toggle selection on.
	 * @param update - The default update function that will update the state.
	 */
	onSelect?: (item: T, update: () => void) => void;
};

// TODO data-id needs to be set on elements - can I do that in here?
// TODO allow bringing own store
export function create_multi<T extends string | number>({
	allowedSelector,
	attribute,
	highlighted,
	items,
	onEnter,
	onSelect,
	pivot,
	selected,
}: RequireAtLeastOne<Partial<State<T>>, 'items'> & AdditionalProps<T>) {
	let root: HTMLElement | null = null;
	const selectedStore = selected ?? writable([]);
	const state = writable<State<T>>({
		highlighted: highlighted ?? null,
		items,
		pivot: pivot ?? null,
		selected: selectedStore,
	});

	const attribute_name = attribute ?? 'data-id';

	function listIncludesAndIsNotEmpty(items: Array<T>, key: T) {
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
				highlighted: item,
				pivot: item,
			};
		});
	}

	function setHighlighted(item: T | null, scrollIntoView = true) {
		if (item) {
			const next_el = (root ?? document)?.querySelector(`[data-id="${item}"]`);
			if (next_el instanceof HTMLElement) {
				if (scrollIntoView) {
					next_el.scrollIntoView({ block: 'nearest' });
				}
				next_el.focus();
			}
		}
		state.update(($state) => {
			return {
				...$state,
				highlighted: item,
			};
		});
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
				highlighted: item,
				pivot: item,
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
				highlighted: item,
				pivot: item,
			};
		});
	}

	function checkIfKeyboardEventsAllowed() {
		if (document.activeElement?.closest(`[${attribute_name}]`)) {
			return true;
		}
		if (allowedSelector && document.activeElement?.matches(allowedSelector)) {
			return true;
		}
		const global_check = global_checkIfKeyboardEventsAllowed();
		return global_check;
	}

	return {
		elements: {
			root: (node: HTMLElement) => {
				root = node;
			},
		},
		events: {
			click: (event: MouseEvent) => {
				if (event.shiftKey) {
					// selectAdjacent();
				}
				if (event.ctrlKey || event.metaKey) {
					// toggleSelection();
				}
				// select();
			},
			keydown: (event: KeyboardEvent) => {
				// todo
				// return;
				if (modifier_keys_pressed(event)) {
					return;
				}
				// check to make sure activelemeent is body or [data-id] inside root
				if (!checkIfKeyboardEventsAllowed()) {
					return;
				}
				if (event.key === 'ArrowUp' || event.key === 'k') {
					// check if any modifier keys are pressed
					if (modifier_keys_pressed(event)) {
						return;
					}
					// check to make sure activelemeent is body or [data-id] inside root
					if (!checkIfKeyboardEventsAllowed()) {
						return;
					}
					// selectAdjacent();
					event.preventDefault();
					state.update(($state) => {
						let index = $state.highlighted
							? $state.items.indexOf($state.highlighted)
							: -1;
						let next: T | null = null;
						let nextEl: HTMLElement | null = null;
						let loops = 0;
						while (!nextEl && index < $state.items.length) {
							next = $state.items[Math.max(0, index - 1)] ?? null;
							nextEl =
								(root ?? document)?.querySelector(`[data-id="${next}"]`) ??
								null;
							console.log({ next, nextEl });
							index++;
							loops++;
							if (loops > 100) {
								console.warn('infinite loop');
								break;
							}
						}
						if (nextEl instanceof HTMLElement) {
							nextEl.scrollIntoView({ block: 'nearest' });
							nextEl.focus();
						}
						return {
							...$state,
							highlighted: next,
						};
					});
				}
				if (event.key === 'ArrowDown' || event.key === 'j') {
					// TODO shift
					if (modifier_keys_pressed(event)) {
						return;
					}
					// check to make sure activelemeent is body or [data-id] inside root
					if (!checkIfKeyboardEventsAllowed()) {
						return;
					}
					event.preventDefault();
					state.update(($state) => {
						let index = $state.highlighted
							? $state.items.indexOf($state.highlighted)
							: -1;
						let next: T | null = null;
						let nextEl: HTMLElement | null = null;
						let loops = 0;
						while (!nextEl && index < $state.items.length) {
							next =
								$state.items[Math.min($state.items.length - 1, index + 1)] ??
								null;
							nextEl =
								(root ?? document)?.querySelector(`[data-id="${next}"]`) ??
								null;
							console.log({ next, nextEl });
							index++;
							loops++;
							if (loops > 100) {
								console.warn('infinite loop');
								break;
							}
						}
						if (nextEl instanceof HTMLElement) {
							nextEl.scrollIntoView({ block: 'nearest' });
							nextEl.focus();
						}
						return {
							...$state,
							highlighted: next,
						};
					});
					// selectAdjacent();
				}
				if (event.key === 'x') {
					if (onSelect) {
						onSelect(get(state).highlighted!, toggleSelection);
					} else {
						toggleSelection();
					}
					// toggleSelection();
				}
				if (event.key === 'Enter') {
					onEnter?.(get(state).highlighted!);
				}
				if (event.key === 'Escape') {
					const dialogEls = document.querySelectorAll(
						'[role="dialog"][data-state="open"]',
					);
					// console.log({ dialogEls });
					if (dialogEls.length > 0) {
						return;
					}
					event.preventDefault();
					deselectAll();
				}
			},
			mouseover: (event: Event) => {
				const target = event.target as HTMLElement;
				const item = target.closest(`[${attribute_name}]`);
				if (item) {
					const id = item.getAttribute(attribute_name);
					const isNumber = typeof id === 'string' && !isNaN(Number(id));
					if (id) {
						setHighlighted((isNumber ? Number(id) : id) as T, false);
					}
				}
			},
		},
		helpers: {
			deselectAll,
			isSelected: (item: T) => {
				const selected = get(selectedStore);
				return selected.includes(item);
			},
			setHighlighted,
			toggleSelection,
			updateItems: (items: Array<T>) => {
				console.log('updateItems', items);
				state.update(($state) => {
					return {
						...$state,
						items,
					};
				});
			},
		},
		stores: {
			selected: selectedStore,
			state,
		},
	};
}
