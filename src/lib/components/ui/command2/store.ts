import { batch, derived, get, writable } from '@amadeus-it-group/tansu';
// borrowing heavily from https://github.com/melt-ui/melt-ui/blob/develop/src/lib/builders/combobox/create.ts - hard dependency here
import {
	effect,
	generateId,
	getOptions,
	isElementDisabled,
	kbd,
} from '@melt-ui/svelte/internal/helpers';
import commandScore from 'command-score';
import { afterUpdate, beforeUpdate, tick } from 'svelte';
import type { Writable } from 'svelte/store';

import {
	concatenateValues,
	deepEqual,
	isBrowser,
	isHTMLElement,
	toString,
} from '$lib/helpers';

export type CommandProps<T> = {
	comparisonFunction?: (a: T, b: T) => boolean;
	// activeValue?: Writable<string | null>;
	defaultActiveValue?: string | null;
	/**
	 * Filter function that takes in a string and inputValue and shuold return a number. If the number is greater than 0, the item will be included in the filtered list.
	 */
	filterFunction?: (arg: { input: string; itemValue: T }) => number;
	onSelect?: (value: T) => void;
	/**
	 * @experimental
	 * If provided, the combobox will be populated with these items initially.
	 * This is useful for when you want to pre-populate the combobox with items.
	 * If you want to populate the combobox with items after it has been created, use the `registerItem` function.
	 * However, these items won't get a group and are intended to be used with <CommandItem shouldRegister={false} and alwaysShow={true} />. One should then use the filtered items store as a slot prop to render the items.
	 *  */
	initialData?: Array<T>;
	initialSelectedValue?: Array<T>;
	inputValue?: Writable<string>;
	multiple?: boolean;
	onClose?: (
		selectedValue: Array<T>,
		activeElement: HTMLElement | null,
		inputValue: string,
	) => void;
	open?: Writable<boolean>;
	/**
	 * The selected value(s) of the combobox. Can be anything.
	 */
	selectedValue?: Writable<Array<T>>;
	/**
	 * Optionally set to `false` to turn off the automatic filtering and sorting.
	 * If `false`, you must conditionally render valid items based on the search query yourself.
	 */
	shouldFilter?: boolean;
	valueToString?: (value: T) => string;
};

type Filtered<T> = {
	count: number;
	groups: Set<string>;
	highScore: number;
	idToScoreMap: Map<string, number>;
	ids: Array<string>;
	items: Array<T>;
};

// prettier-ignore
export const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];
export { kbd };

export function shouldFilterStore(defaultValue?: boolean) {
	const store = writable(defaultValue ?? true);
	return {
		...store,
		defaultValue: defaultValue ?? true,
		reset: () => {
			store.set(defaultValue ?? true);
		},
	};
}

export const SELECT_EVENT_NAME = 'command-item-select';

export function createCommandStore<T>(props?: CommandProps<T>) {
	const { open } = props ?? {};
	const openStore = open ?? writable(false);
	const activeElement = writable<HTMLElement | null>(null);
	const activeValue = derived(
		activeElement,
		($activeElement) => {
			if (!$activeElement) {
				return null;
			}
			return $activeElement.getAttribute('data-value');
		},
		props?.defaultActiveValue ?? null,
	);
	const inputValue = props?.inputValue ?? writable('');
	const selectedValue = props?.selectedValue ?? writable<Array<T>>([]);
	// TODO: shuold we maintain selectedIds without deriving because of potentially expensive derived function?

	const allItemIds = writable<Set<string>>(new Set()); // [...itemIds]
	const idsToValueMap = writable<Map<string, T>>(new Map()); // id → value
	const allGroupIds = writable<Map<string, Set<string>>>(new Map()); // groupId → [...itemIds]
	const idsToCallbackMap = writable<Map<string, () => void>>(new Map()); // id → callback
	const idsToValueToStringFnMap = writable<Map<string, (value: T) => string>>(
		new Map(),
	); // id → valueToString fn (each can optionally set their own)

	const selectedIds = derived(
		[selectedValue, idsToValueMap],
		([$selectedValue, $idsToValueMap]) => {
			const ids: Array<string> = [];
			for (const value of $selectedValue) {
				const _ids = Array.from($idsToValueMap.entries())
					.filter(([_, v]) => {
						if (props?.comparisonFunction) {
							return props.comparisonFunction(v, value);
						}
						return deepEqual(v, value);
					})
					.map(([id, _]) => id);
				ids.push(..._ids);
			}
			return ids;
		},
	);

	const container = writable<HTMLElement | null>(null);

	const filterFunction =
		props?.filterFunction ??
		(({ input, itemValue }) => {
			return commandScore(toString(itemValue), input);
		});

	const shouldFilter = shouldFilterStore(
		props?.shouldFilter === false ? false : true,
	);

	const internalValueToString =
		props?.valueToString ??
		((v) => {
			return concatenateValues(v);
		});

	// const filtered = derived(
	// 	[
	// 		allItemIds,
	// 		allGroupIds,
	// 		inputValue,
	// 		idsToValueMap,
	// 		idsToValueToStringFnMap,
	// 		shouldFilter,
	// 	],
	// 	([
	// 		$items,
	// 		$groups,
	// 		$inputValue,
	// 		$idsToValueMap,
	// 		$idsToValueToStringFnMap,
	// 		$shouldFilter,
	// 	]) => {
	// 		if ($shouldFilter === false) {
	// 			return {
	// 				count: $items.size,
	// 				groups: new Set(),
	// 				highScore: 0,
	// 				idToScoreMap: new Map(),
	// 				ids: Array.from($items),
	// 				items: Array.from($idsToValueMap.values()),
	// 			} as Filtered<T>;
	// 		}
	// 		console.time('filtering');
	// 		const idToScoreMap = new Map<string, number>();
	// 		const groups = new Set<string>();

	// 		let highScore = 0;

	// 		const filteredIds = Array.from($items)
	// 			.filter((item) => {
	// 				const value = $idsToValueMap.get(item);
	// 				if (!value) {
	// 					return false;
	// 				}
	// 				const valueToStringFn =
	// 					$idsToValueToStringFnMap.get(item) ?? internalValueToString;
	// 				const score = filterFunction(valueToStringFn(value), $inputValue);
	// 				idToScoreMap.set(item, score);
	// 				if (score > highScore) {
	// 					highScore = score;
	// 				}
	// 				if (score > 0) {
	// 					return true;
	// 				}
	// 				return false;
	// 			})
	// 			.sort((a, b) => {
	// 				const aScore = idToScoreMap.get(a) ?? 0;
	// 				const bScore = idToScoreMap.get(b) ?? 0;
	// 				return bScore - aScore;
	// 			});

	// 		// Filter groups based on items
	// 		for (const [groupId, group] of $groups) {
	// 			for (const itemId of group) {
	// 				if (filteredIds.includes(itemId)) {
	// 					groups.add(groupId);
	// 					break;
	// 				}
	// 			}
	// 		}

	// 		const items = filteredIds.map((id) => $idsToValueMap.get(id)!);

	// 		ensureActiveItem(0);
	// 		console.log({
	// 			$idsToValueMap,
	// 			$items,
	// 			groups,
	// 			ids,
	// 			items,
	// 		});
	// 		console.timeEnd('filtering');
	// 		return {
	// 			count: filteredIds.length,
	// 			groups,
	// 			highScore,
	// 			idToScoreMap,
	// 			ids: filteredIds,
	// 			items,
	// 		} as Filtered<T>;
	// 	},
	// );

	async function ensureActiveItem(index?: number) {
		if (!isBrowser) {
			return;
		}
		await tick();
		const $activeElement = get(activeElement);
		const menuElement = document.getElementById(ids.menu);
		if (!isHTMLElement(menuElement)) {
			return;
		}
		const itemElements = getOptions(menuElement);
		if (!itemElements.length) {
			return;
		}
		// Disabled and hidden items can't be highlighted. Skip them.
		const candidateNodes = itemElements.filter(
			(opt) => !isElementDisabled(opt) && opt.dataset.hidden === undefined,
		);
		// Get the index of the currently highlighted item.
		const currentIndex = $activeElement
			? candidateNodes.indexOf($activeElement)
			: -1;

		// If there is no currently highlighted item, highlight the first item.
		let elementToSet: HTMLElement | null = null;
		if (currentIndex === -1 && candidateNodes[0]) {
			elementToSet = candidateNodes[0];
		} else if (
			index !== undefined &&
			(currentIndex === -1 || index !== currentIndex)
		) {
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

	if (props?.initialSelectedValue) {
		selectedValue.set(props.initialSelectedValue);
	}

	if (props?.initialData) {
		const items = props.initialData;
		console.time('initialData');
		const ids = items.map((item) => {
			const id = generateId();
			idsToValueMap.update(($map) => {
				$map.set(id, item);
				return $map;
			});
			return id;
		});
		allItemIds.update(($items) => {
			for (const id of ids) {
				$items.add(id);
			}
			return $items;
		});
		console.timeEnd('initialData');
	}

	const ids = {
		input: generateId(),
		label: generateId(),
		menu: generateId(),
		option: generateId(),
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
		if (!triggerEl) {
			return;
		}

		// The active trigger is used to anchor the menu to the input element.
		activeTrigger.set(triggerEl);

		// Wait a tick for the menu to open then highlight the selected item.
		tick().then(() => {
			const menuElement = document.getElementById(ids.menu);
			if (!isHTMLElement(menuElement)) {
				return;
			}
			const selectedItem = menuElement.querySelector('[aria-selected=true]');
			if (!isHTMLElement(selectedItem)) {
				return;
			}
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
		// const value = item.getAttribute('data-value');

		const $idsToValueMap = get(idsToValueMap);
		console.log({ $idsToValueMap });
		const val = $idsToValueMap.get(item.id);

		const containsPages = item.getAttribute('data-contains-pages') !== null;

		console.log({ val });

		if (!containsPages) {
			// Then update selected value
			selectedValue.update(($selectedValue) => {
				if (!val) {
					return $selectedValue;
				}
				if (!props?.multiple) {
					return [val];
				}
				const idx = $selectedValue.findIndex((v) => deepEqual(v, val));
				if (idx !== -1) {
					// TODO: is thhis the best way to do this?
					return $selectedValue.filter((_, i) => i !== idx);
				} else {
					return props?.multiple ? [...$selectedValue, val] : [val];
				}
			});
		}

		console.log({
			selectedValue: get(selectedValue),
		});

		console.log('dispatching event to', item);

		// const callback = get(idsToCallbackMap).get(item.id);
		// console.log({ callback });
		// if (callback) {
		// 	callback();
		// }

		item.dispatchEvent(new Event(SELECT_EVENT_NAME));
	}

	function registerItem(id: string | Array<string>, groupId?: string) {
		console.log(`Registering item`, { groupId, id });

		registerQueue.push(() => {
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
		});
		return () => {
			// REVIEW is this necessary?
			registerQueue.push(() => {
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
			});
		};
	}

	function registerItemValue(
		items: Array<{
			id: string;
			value: T;
		}>,
	): void;
	function registerItemValue(id: string, value: T): void;
	function registerItemValue(
		id: string | Array<{ id: string; value: T }>,
		value?: T,
	) {
		console.log(`Registering item value`, { id, value });
		registerQueue.push(() => {
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
		});
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

	let registerQueue: Array<() => void> = [];
	afterUpdate(() => {
		if (!registerQueue.length) {
			return;
		}
		console.time('registerQueue');
		console.log(`running registerQueue`, { registerQueue });
		batch(() => {
			console.log('batching');
			for (const fn of registerQueue) {
				console.log(`running fn`);
				fn();
			}
		});
		console.timeEnd('registerQueue');
		registerQueue = [];
	});

	afterUpdate(() => {
		// we should ensure first item is chosen when filtered inputvalue changes
	});

	effect([inputValue], ([$inputValue]) => {
		ensureActiveItem(0);
	});

	function registerCallback(id: string | Array<string>, callback: () => void) {
		registerQueue.push(() => {
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
		});

		return () => {
			registerQueue.push(() => {
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
			});
		};
	}

	function registerValueToString(id: string, callback: (value: any) => string) {
		registerQueue.push(() => {
			idsToValueToStringFnMap.update(($map) => {
				$map.set(id, callback);
				return $map;
			});
		});
	}

	return {
		actions: {
			closeMenu: () => {
				/*openStore.set(false)*/
				tick().then(() => {
					props?.onClose?.(
						get(selectedValue),
						get(activeElement),
						get(inputValue),
					);
				});
			},
			openMenu,
			reset,
			selectItem,
		},
		elements: {
			container,
		},
		helpers: {
			isValueSelected: (value: T) => {
				// TODO: should we pass in id instead here? But we keep track of selectedValue by value, not id
				const $selectedValue = get(selectedValue);
				return $selectedValue.some((v) => deepEqual(v, value));
			},
			registerCallback,
			registerGroup,
			registerItem,
			registerItemValue,
			registerItems: (
				items: Array<{
					id: string;
					value: T;
					// groupId?: string;
				}>,
				groupId?: string,
			) => {
				registerItemValue(items);
				return registerItem(
					items.map((item) => item.id),
					groupId,
				);
			},
			registerValueToString,
		},
		ids,
		options: {
			filterFunction,
			multiple: props?.multiple ?? false,
		},
		state: {
			activeElement,
			activeValue,
			filtered: writable({}),
			inputValue,
			open: openStore,
			selectedIds,
			selectedValue,
			shouldFilter,
		},
	};
}
