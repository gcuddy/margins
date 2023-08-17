import { isBrowser, isHTMLElement } from '$lib/helpers';
// borrowing heavily from https://github.com/melt-ui/melt-ui/blob/develop/src/lib/builders/combobox/create.ts - hard dependency here
import { effect, generateId, getOptions, isElementDisabled, kbd } from '@melt-ui/svelte/internal/helpers';
import { tick } from 'svelte';
import { Writable, derived, get, writable } from 'svelte/store';

import commandScore from 'command-score';

type SelectedValue =
	| {
			multiple?: false;
			selectedValue?: Writable<string | null>;
	  }
	| {
			multiple: true;
			selectedValue?: Writable<string[]>;
	  };

export type CommandProps = {
	open?: Writable<boolean>;
	inputValue?: Writable<string>;
	// activeValue?: Writable<string | null>;
	defaultActiveValue?: string | null;
	multiple?: boolean;
	/**
	 * The selected value(s) of the combobox. If `multiple` is `true`, this will be an array of strings. Otherwise, it will be an array with a single string.
	 */
	selectedValue?: Writable<string[]>;
	defaultSelectedValue?: string[];
	filterFunction?: (item: string, inputValue: string) => number;
};

type Filtered = {
	count: number;
	itemToScoreMap: Map<string, number>;
	items: string[];
	groups: Set<string>;
};

// prettier-ignore
export const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];
export { kbd };

export const SELECT_EVENT_NAME = 'command-item-select';

export function createCommandStore(props?: CommandProps) {
	const { open } = props ?? {};
	const openStore = open ?? writable(false);
	const activeElement = writable<HTMLElement | null>(null);
	const activeValue = derived(
		activeElement,
		($activeElement) => {
			if (!$activeElement) return null;
			return $activeElement.getAttribute('data-value');
		},
		props?.defaultActiveValue ?? null
	);
	const inputValue = props?.inputValue ?? writable('');
	const selectedValue = props?.selectedValue ?? writable<string[]>([]);

	const allItemIds = writable<Set<string>>(new Set()); // [...itemIds]
	const idsToValueMap = writable<Map<string, string>>(new Map()); // id → value
	const allGroupIds = writable<Map<string, Set<string>>>(new Map()); // groupId → [...itemIds]
    const idsToCallbackMap = writable<Map<string, () => void>>(new Map()); // id → callback

    const container = writable<HTMLElement | null>(null);

	const filterFunction = props?.filterFunction ?? commandScore;

	const filtered = derived(
		[allItemIds, allGroupIds, inputValue, idsToValueMap],
		([$items, $groups, $inputValue, $idsToValueMap]) => {
			const itemToScoreMap = new Map<string, number>();
			const groups = new Set<string>();
			// TODO should we use element ids here?
			const filteredItems = Array.from($items)
				.filter((item) => {
					const value = $idsToValueMap.get(item);
					if (!value) return false;
					const score = filterFunction(value, $inputValue);
					itemToScoreMap.set(item, score);
					if (score > 0) {
						return true;
					}
					return false;
				})
				.sort((a, b) => {
					const aScore = itemToScoreMap.get(a) ?? 0;
					const bScore = itemToScoreMap.get(b) ?? 0;
					return bScore - aScore;
				});

			// Filter groups based on items
			for (const [groupId, group] of $groups) {
				for (const itemId of group) {
					if (filteredItems.includes(itemId)) {
						groups.add(groupId);
						break;
					}
				}
			}

			ensureActiveItem(0);

			return {
				count: filteredItems.length,
				itemToScoreMap,
				items: filteredItems,
				groups
			} as Filtered;
		}
	);

	async function ensureActiveItem(index?: number) {
		if (!isBrowser) return;
		await tick();
		const $activeElement = get(activeElement);
		const menuElement = document.getElementById(ids.menu);
		if (!isHTMLElement(menuElement)) return;
		const itemElements = getOptions(menuElement);
		if (!itemElements.length) return;
		// Disabled items can't be highlighted. Skip them.
		const candidateNodes = itemElements.filter((opt) => !isElementDisabled(opt));
		// Get the index of the currently highlighted item.
		const currentIndex = $activeElement ? candidateNodes.indexOf($activeElement) : -1;

		// If there is no currently highlighted item, highlight the first item.
		let elementToSet: HTMLElement | null = null;
		if (currentIndex === -1 && candidateNodes[0]) {
			elementToSet = candidateNodes[0];
		} else if (index !== undefined && (currentIndex === -1 || index !== currentIndex)) {
			const el = candidateNodes[index];
			if (el) {
				elementToSet = el;
			}
		}
		if (elementToSet) {
			activeElement.set(elementToSet);
			elementToSet.scrollIntoView({ block: 'nearest' });
		}
	}

	// TODO let this be changed
	let shouldFilter = true;

	if (props?.defaultSelectedValue) {
		selectedValue.set(props.defaultSelectedValue);
	}

	const ids = {
		input: generateId(),
		menu: generateId(),
		option: generateId(),
		label: generateId()
	};

	// Trigger element for the popper portal. This will be our input element.
	const activeTrigger = writable<HTMLElement | null>(null);

	// const state = writable({
	// 	ids,
	// 	state: {
	// 		open: openStore
	// 	}
	// });
	function openMenu(currentOpenState = false) {
		if (!currentOpenState) {
			openStore.set(true);
		}

		const triggerEl = document.getElementById(ids.input);
		if (!triggerEl) return;

		// The active trigger is used to anchor the menu to the input element.
		activeTrigger.set(triggerEl);

		// Wait a tick for the menu to open then highlight the selected item.
		tick().then(() => {
			const menuElement = document.getElementById(ids.menu);
			if (!isHTMLElement(menuElement)) return;
			const selectedItem = menuElement.querySelector('[aria-selected=true]');
			if (!isHTMLElement(selectedItem)) return;
			activeElement.set(selectedItem);
		});
	}

	function reset() {
		// TODO: determine how we want to hanndle thiis - should inputvalue be reset, or sohuld it retian selected value?
		// For now going with reset because it's a command component

		inputValue.set('');
		// todo reset items
	}

	function selectItem(item: HTMLElement) {
		const value = item.getAttribute('data-value');

        console.log('selecting item', { value })

        const containsPages = item.getAttribute('data-contains-pages') !== null;

        if (!containsPages) {
            // Then update selected value
            selectedValue.update(($selectedValue) => {
                if (!value) return $selectedValue;
                if ($selectedValue.includes(value)) {
                    return $selectedValue.filter((v) => v !== value);
                } else {
                    if (props?.multiple) {
                        return [...$selectedValue, value];
                    } else {
                        return [value];
                    }
                }
            });
        }

        console.log({
            selectedValue: get(selectedValue)
        })

        console.log('dispatching event to', item)

        const callback = get(idsToCallbackMap).get(item.id);
        if (callback) {
            callback();
        }


		// item.dispatchEvent(new Event(SELECT_EVENT_NAME));
	}

    effect(selectedValue, (selectedValue) => {
        console.log('selectedValue changed', { selectedValue })

    })

	function registerItem(id: string | string[], groupId?: string) {
		allItemIds.update(($items) => {
			if (Array.isArray(id)) {
				for (const i of id) {
					$items.add(i);
				}
				return $items;
			}
			$items.add(id);
			return $items;
		});
		if (groupId) {
			allGroupIds.update(($groups) => {
				const group = $groups.get(groupId) ?? new Set();
				const ids = Array.isArray(id) ? id : [id];
				for (const id of ids) {
					group.add(id);
				}
				$groups.set(groupId, group);
				return $groups;
			});
		}
		return () => {
			// REVIEW is this necessary?
			allItemIds.update(($items) => {
				if (Array.isArray(id)) {
					for (const i of id) {
						$items.delete(i);
					}
					return $items;
				}
				$items.delete(id);
				return $items;
			});
			idsToValueMap.update(($map) => {
				if (Array.isArray(id)) {
					for (const i of id) {
						$map.delete(i);
					}
					return $map;
				}
				$map.delete(id);
				return $map;
			});
		};
	}

	function registerItemValue(
		items: {
			id: string;
			value: string;
		}[]
	): void;
	function registerItemValue(id: string, value: string): void;
	function registerItemValue(id: string | { id: string; value: string }[], value?: string) {
		if (Array.isArray(id)) {
			idsToValueMap.update(($map) => {
				for (const { id: i, value } of id) {
					$map.set(i, value);
				}
				return $map;
			});
		} else if (value) {
			idsToValueMap.update(($map) => {
				$map.set(id, value);
				return $map;
			});
		}
	}

	function registerGroup(id: string) {
		allGroupIds.update(($groups) => {
			if (!$groups.has(id)) {
				$groups.set(id, new Set());
			}
			return $groups;
		});
		return () => {
			allGroupIds.update(($groups) => {
				$groups.delete(id);
				return $groups;
			});
			idsToValueMap.update(($map) => {
				$map.delete(id);
				return $map;
			});
		};
	}

    function registerCallback(id: string | string[], callback: (e: Event) => void) {
        idsToCallbackMap.update(($map) => {
            if (Array.isArray(id)) {
                for (const i of id) {
                    $map.set(i, callback);
                }
                return $map;
            }
            $map.set(id, callback);
            return $map;
        });

        return () => {
            idsToCallbackMap.update(($map) => {
                if (Array.isArray(id)) {
                    for (const i of id) {
                        $map.delete(i);
                    }
                    return $map;
                }
                $map.delete(id);
                return $map;
            });
        }
    }

	return {
		ids,
		state: {
			open: openStore,
			inputValue,
			activeElement,
			activeValue,
			selectedValue,
			filtered
		},
		helpers: {
			registerItem,
			registerItemValue,
			registerItems: (
				items: {
					id: string;
					value: string;
					// groupId?: string;
				}[],
				groupId?: string
			) => {
				registerItemValue(items);
				return registerItem(
					items.map((item) => item.id),
					groupId
				);
			},
			registerGroup,
            registerCallback
		},
		actions: {
			openMenu,
			closeMenu: () => /*openStore.set(false)*/ {}, // we dont't actually want this, i think
			reset,
			selectItem
		},
        elements: {
            container
        }
	};
}
