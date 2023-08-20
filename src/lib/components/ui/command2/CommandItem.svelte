<script lang="ts">
	import { isHTMLElement } from '$lib/helpers';

	import { cn } from '$lib/utils';
	import { generateId, isElementDisabled } from '@melt-ui/svelte/internal/helpers';
	import { getContext, onMount } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { ctx } from './ctx';
	import { SELECT_EVENT_NAME } from './store';

	type T = $$Generic;

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		value?: T;
		onSelect?: (value: T | undefined) => void;
		disabled?: boolean;
		unstyled?: boolean;
		id?: string;
		groupId?: string;
		shouldRegister?: boolean;
		alwaysShow?: boolean;
		containsPages?: boolean;
		cancelClose?: string | HTMLElement | HTMLElement[];
        valueToString?: (value: T) => string
	};

	export let disabled = false;
	export let value: T | undefined = undefined;
	export let onSelect = (value: T | undefined) => {};
	export let unstyled = false;
	export let id = generateId();
	export let groupId = getContext('command_groupId') as string | undefined;
	export let shouldRegister = true;
	export let alwaysShow = false;
	export let containsPages = false;
	export let cancelClose: $$Props['cancelClose'] = undefined;
    export let valueToString: $$Props['valueToString'] = undefined;

	let className: $$Props['class'] = undefined;
	export { className as class };

	const {
		state: { selectedValue, activeValue, activeElement, inputValue, filtered, selectedIds },
		actions,
		helpers
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
			console.log({ cancelClose, target: e.target, current: e.currentTarget });
			if (Array.isArray(cancelClose)) {
				if (cancelClose.includes(e.target as HTMLElement)) return;
			} else if (isHTMLElement(cancelClose)) {
				if (cancelClose === e.target) return;
			} else if (typeof cancelClose === 'string') {
				if (e.target instanceof Element && e.target.closest(cancelClose)) return;
			}
		}
		actions.closeMenu();
	}

	// TODO: add way to not close
	function handleSelect() {
		if (disabled) return;
		onSelect(value);
		// if (
		// 	!e.defaultPrevented &&
		// 	(e instanceof MouseEvent || e instanceof PointerEvent) &&
		// 	// check to make sure we didn't click a checkbox
		// 	!(e.target instanceof HTMLInputElement && e.target.type === 'checkbox')
		// ) {
		// 	actions.closeMenu();
		// }
	}

	$: if (shouldRegister) {
		console.log('should register', { value });
		helpers.registerItemValue(id, value);
        if (valueToString) helpers.registerValueToString(id, valueToString)
	}

	onMount(() => {
		if (node) {
			node.addEventListener(SELECT_EVENT_NAME, handleSelect);
			value = (value || node.textContent?.trim()?.toLowerCase() || '') as T | undefined;
		}

		let unmount = () => {};
		if (shouldRegister) {
			unmount = helpers.registerItem(id, groupId);
		}

		const unsubCallback = helpers.registerCallback(id, handleSelect);
		return () => {
			if (node) {
				node.removeEventListener(SELECT_EVENT_NAME, handleSelect);
			}
			unmount();
			unsubCallback();
		};
	});

	$: render = alwaysShow || !$inputValue || $filtered.ids.includes(id);
	$: selected = /*$selectedValue.includes(value) ??*/ $selectedIds.includes(id);


</script>

{#if render}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class={cn(
			!unstyled &&
				'relative group text-left flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className
		)}
		bind:this={node}
		{id}
		aria-disabled={disabled ? true : undefined}
		data-disabled={disabled ? '' : undefined}
		aria-selected={selected}
		data-value={value}
		role="option"
		on:pointermove={handlePointerMove}
		on:click={handleClick}
		data-highlighted={$activeElement === node ? '' : undefined}
		data-contains-pages={containsPages ? '' : undefined}
		tabindex={-1}
		data-command-item
	>
		<!--  -->
		<slot isSelected={selected} />
	</div>
{/if}
