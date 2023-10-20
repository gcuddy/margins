<script lang="ts">
	import { commandItemVariants } from './style';

	import {
		generateId,
		isElementDisabled,
	} from '@melt-ui/svelte/internal/helpers';
	import { getContext, onMount } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import { deepEqual, isHTMLElement } from '$lib/helpers';
	import { cn } from '$lib/utils';

	import { ctx } from './ctx';
	import { SELECT_EVENT_NAME } from './store';

	type T = $$Generic;

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		cancelClose?: string | HTMLElement | Array<HTMLElement>;
		containsPages?: boolean;
		disabled?: boolean;
		groupId?: string;
		id?: string;
		label?: string;
		onSelect?: (value: T | undefined) => void;
        selected?: boolean;
		unstyled?: boolean;
		value?: T;
	};

	export let disabled = false;
	export let onSelect = (value: T | undefined) => {};
	export let unstyled = false;
	export let id = generateId();
	export let groupId = getContext('command_groupId') as string | undefined;
	export let shouldRegister = true;
	export let containsPages = false;
	export let cancelClose: $$Props['cancelClose'] = undefined;
	export let valueToString: $$Props['valueToString'] = undefined;
	export let label = '';
	export let value: T | undefined = undefined;

	$: if (!label && node) {
		label = node.textContent?.trim() || '';
	}

	$: if (!value) {
		value = label as T;
	}

	let className: $$Props['class'] = undefined;
	export { className as class };

	const {
		actions,
		helpers,
		options: { filterFunction, comparisonFunction },
		state: {
			activeElement,
			activeValue,
			filtered,
			inputValue,
			selectedIds,
			selectedValue,
			shouldFilter,
		},
	} = ctx.get();

	let node: HTMLElement;

	function handlePointerMove() {
		// Skip highlighting if the item is already highlighted.

		if (node === $activeElement) {
			return;
		}

		// If the item is disabled, clear the highlight.
		if (isElementDisabled(node)) {
			activeElement.set(null);
			return;
		}
		// Otherwise, proceed.
		activeElement.set(node);
	}

	function handleClick(e: Event) {
		// If the item is disabled, `preventDefault` to stop the input losing focus.
		if (isElementDisabled(node)) {
			e.preventDefault();
			return;
		}
		// Otherwise, select the item and close the menu.
		actions.selectItem(node);
		if (cancelClose) {
			if (Array.isArray(cancelClose)) {
				if (cancelClose.includes(e.target as HTMLElement)) {
					return;
				}
			} else if (isHTMLElement(cancelClose)) {
				if (cancelClose === e.target) {
					return;
				}
			} else if (typeof cancelClose === 'string') {
				if (e.target instanceof Element && e.target.closest(cancelClose)) {
					return;
				}
			}
		}
		actions.closeMenu();
	}


	let hidden = false;
	$: if ($shouldFilter === false) {
		hidden = false;
	} else if (!$inputValue) {
		hidden = false;
	} else {
		hidden =
			filterFunction({
				input: $inputValue,
				itemValue: value,
			}) === 0;
	}

	// false : !$inputValue ? false : !$filtered.ids.includes(id);
    export let selected: boolean | undefined = undefined;
	$: _selected = $selectedValue.some((sv) => {
        return comparisonFunction(sv.value, value)
    });
    $: computedSelected = selected !== undefined ? selected : _selected;

	function registerEvent(node: HTMLElement) {
		node.addEventListener(SELECT_EVENT_NAME, () => {
			onSelect(value);
		});

		return {
			destroy() {
				node.removeEventListener(SELECT_EVENT_NAME, () => {
					onSelect(value);
				});
			},
		};
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class={cn(
		!unstyled &&
			commandItemVariants(),
		className,
		hidden && 'hidden',
	)}
	bind:this={node}
	{id}
	use:registerEvent
	data-value={JSON.stringify(value)}
	data-label={label}
	data-disabled={disabled ? '' : undefined}
	aria-disabled={disabled ? true : undefined}
	aria-selected={computedSelected}
	{hidden}
	data-hidden={hidden ? '' : undefined}
	role="option"
	on:pointermove={handlePointerMove}
	on:click={handleClick}
	data-highlighted={$activeElement === node ? '' : undefined}
	data-contains-pages={containsPages ? '' : undefined}
	tabindex={-1}
	data-command-item
>
	<!--  -->
	<slot isSelected={computedSelected} />
</div>
