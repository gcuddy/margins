import { dialogs } from '$components/ui/dialog2/store';
import { Writable, get, writable } from 'svelte/store';
import type { RequireAtLeastOne } from 'type-fest';

type State<T extends string | number> = {
	highlighted: T | null;
	items: T[];
	selected: Writable<T[]>;
	pivot: T | null;
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
	items,
	highlighted,
	pivot,
	selected,
	attribute,
	allowedSelector,
    onEnter,
    onSelect
}: RequireAtLeastOne<Partial<State<T>>, 'items'> & AdditionalProps<T>) {
	let root: HTMLElement | null = null;
	const selectedStore = selected ?? writable([]);
	const state = writable<State<T>>({
		highlighted: highlighted ?? null,
		items,
		selected: selectedStore,
		pivot: pivot ?? null
	});

	const attribute_name = attribute ?? 'data-id';

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

	function setHighlighted(item: T | null, scrollIntoView = true) {
        if (item) {
            const next_el = (root ?? document)?.querySelector(`[data-id="${item}"]`);
            if (next_el instanceof HTMLElement ) {
                if (scrollIntoView) next_el.scrollIntoView({ block: 'nearest' });
                next_el.focus();
            }
        }
		state.update(($state) => {
			return {
				...$state,
				highlighted: item
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

	function checkIfKeyboardEventsAllowed() {
		console.log('checking if keyboard events allowed');
		const bodyCheck = document.activeElement !== document.body;
		console.log({ attribute_name });
		const attrCheck = !document.activeElement?.closest(`[${attribute_name}]`);
		// const allowedCheck = !document.activeElement?.matches(allowed);
		console.log({ bodyCheck, attrCheck });
		if (document.activeElement === document.body) {
			return true;
		}
		if (document.activeElement?.closest(`[${attribute_name}]`)) {
			return true;
		}
        if (allowedSelector && document.activeElement?.matches(allowedSelector)) {
            return true;
        }
		// if (
		// 	document.activeElement !== document.body &&
		// 	!document.activeElement?.closest(`[${attribute_name}]`)
		// ) {
		// 	return false;
		// }
		return false;
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
				console.log({ event });
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
                        let index = $state.highlighted ? $state.items.indexOf($state.highlighted) : -1;
                        let next: T | null = null;
                        let nextEl: HTMLElement | null = null;
                        let loops = 0;
                        while (!nextEl && index < $state.items.length) {
                            next = $state.items[Math.max(0, index - 1)] ?? null;
                            nextEl = (root ?? document)?.querySelector(`[data-id="${next}"]`) ?? null;
                            console.log({next, nextEl})
                            index++;
                            loops++;
                            if (loops > 100) {
                                console.warn('infinite loop')
                                break;
                            }
                        }
						if (nextEl instanceof HTMLElement) {
							nextEl.scrollIntoView({ block: 'nearest' });
							nextEl.focus();
						}
						return {
							...$state,
							highlighted: next
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
						let index = $state.highlighted ? $state.items.indexOf($state.highlighted) : -1;
                        let next: T | null = null;
                        let nextEl: HTMLElement | null = null;
                        let loops = 0;
                        while (!nextEl && index < $state.items.length) {
                            next = $state.items[Math.min($state.items.length - 1, index + 1)] ?? null;
                            nextEl = (root ?? document)?.querySelector(`[data-id="${next}"]`) ?? null;
                            console.log({next, nextEl})
                            index++;
                            loops++;
                            if (loops > 100) {
                                console.warn('infinite loop')
                                break;
                            }
                        }
						if (nextEl instanceof HTMLElement) {
							nextEl.scrollIntoView({ block: 'nearest' });
							nextEl.focus();
						}
						return {
							...$state,
							highlighted: next
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
