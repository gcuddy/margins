<script lang="ts" context="module">
	type OptionData = {
		disabled: boolean;
		domRef: HTMLElement | null;
	};
	export interface NavState {
		// State
		changeActiveOnHover: boolean;
		orientation: 'horizontal' | 'vertical';
		disabled: boolean;
		items: { id: string; dataRef: OptionData }[];
		activeIndex: number | null;

		goToOption(focus: Focus, id?: string): void;
		registerOption(id: string, dataRef: OptionData): void;
		unregisterOption(id: string): void;
	}

	const CONTEXT_NAME = 'keyboard_nav_store';

	export function useKeyboardNavContext(component: string): Readable<NavState> {
		let context: Writable<NavState> | undefined = getContext(CONTEXT_NAME);
		if (context === undefined) {
			throw new Error(`<${component} /> is missing a parent <KeyboardNav /> component.`);
		}
		return context;
	}
</script>

<script lang="ts">
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';
	import { Keys } from '$lib/types/keyboard';
	import { calculateActiveIndex, Focus } from '$lib/utils/calculate-active-index';
	import { getContext, onMount, setContext } from 'svelte';
	import { writable, type Readable, type Writable } from 'svelte/store';

	export let disabled = false;
	export let changeActiveOnHover = false;
	export let horizontal = false;

	export let activeIndex: NavState['activeIndex'] = null;
	let startingIndex = activeIndex;
	let items: NavState['items'] = [];
	$: orientation = (horizontal ? 'horizontal' : 'vertical') as NavState['orientation'];
	const api = writable<NavState>({
		changeActiveOnHover,
		disabled,
		items,
		activeIndex,
		orientation,
		goToOption(focus: Focus, id?: string) {
			if (disabled) return;
			let nextActiveOptionIndex = calculateActiveIndex(
				focus === Focus.Specific
					? { focus: Focus.Specific, id: id! }
					: { focus: focus as Exclude<Focus, Focus.Specific> },
				{
					resolveItems: () => items,
					resolveActiveIndex: () => activeIndex,
					resolveId: (option) => option.id,
					resolveDisabled: (option) => option.dataRef.disabled,
				}
			);
			console.log(`setting activeIndex to ${nextActiveOptionIndex}`);
			activeIndex = nextActiveOptionIndex;
		},
		registerOption: (id: string, dataRef) => {
			let currentActiveItem = activeIndex !== null ? items[activeIndex] : null;

			// hm. copy and pasting but not sure at all about this.
			let orderMap = Array.from(container.querySelectorAll('[id^="keyboard-nav-item-"]')!).reduce(
				(lookup, element, index) => Object.assign(lookup, { [element.id]: index }),
				{}
			) as Record<string, number>;

			let nextItems = [...items, { id, dataRef }];
			nextItems.sort((a, z) => orderMap[a.id] - orderMap[z.id]);
			items = nextItems;

			// Maintain the correct item active
			activeIndex = (() => {
				if (items[startingIndex]) {
					// this seems like an ugly way to do this, but maybe it works??
					// probably missing some edge cases here — maybe virtual lists would be a bad case
					// or if this does suddenly appear it seems like maybe not the best?
					let _index = startingIndex;
					startingIndex = null;
					return _index;
				}
				if (currentActiveItem === null) return null;
				return items.indexOf(currentActiveItem);
			})();
		},
		unregisterOption: (id: string) => {
			let nextItems = items.slice();
			let currentActiveItem = activeIndex !== null ? nextItems[activeIndex] : null;
			let idx = nextItems.findIndex((a) => a.id === id);
			if (idx !== -1) nextItems.splice(idx, 1);
			items = nextItems;
			activeIndex = (() => {
				if (idx === activeIndex) return null;
				if (currentActiveItem === null) return null;

				// If we removed the option before the actual active index, then it would be out of sync. To
				// fix this, we will find the correct (new) index position.
				return nextItems.indexOf(currentActiveItem);
			})();
		},
	});
	setContext(CONTEXT_NAME, api);
	let container: HTMLElement | undefined;
	$: api.update((obj) => {
		return {
			...obj,
			items,
			activeIndex,
			disabled,
			orientation,
		};
	});

	async function handleKeydown(event: KeyboardEvent) {
		if (disabled) return;
		if ($disableGlobalKeyboardShortcuts) return;

		switch (event.key) {
			// Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12

			case Keys.Enter:
				break;

			case $api.orientation === 'horizontal' ? Keys.ArrowRight : Keys.ArrowDown:
			case $api.orientation === 'vertical' && 'j':
				event.preventDefault();
				event.stopPropagation();
				return $api.goToOption(Focus.Next);

			case $api.orientation === 'horizontal' ? Keys.ArrowLeft : Keys.ArrowUp || 'k':
			case $api.orientation === 'vertical' && 'k':
				event.preventDefault();
				event.stopPropagation();
				return $api.goToOption(Focus.Previous);

			case Keys.Home:
			case Keys.PageUp:
				event.preventDefault();
				event.stopPropagation();
				return $api.goToOption(Focus.First);

			case Keys.End:
			case Keys.PageDown:
				event.preventDefault();
				event.stopPropagation();
				return $api.goToOption(Focus.Last);
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />
<!-- Wrapper Item -->
<div bind:this={container}>
	<slot />
</div>
