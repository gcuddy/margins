<script lang="ts">
	import { cn } from '$lib/utils';
	import { generateId, isElementDisabled } from '@melt-ui/svelte/internal/helpers';
	import { getContext, onMount } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { ctx } from './ctx';
	import { SELECT_EVENT_NAME } from './store';

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		value?: string;
		onSelect?: (value: string) => void;
		disabled?: boolean;
		unstyled?: boolean;
		id?: string;
		groupId?: string;
		shouldRegister?: boolean;
		alwaysShow?: boolean;
	};

	export let disabled = false;
	export let value = '';
	export let onSelect = (value: string) => {};
	export let unstyled = false;
	export let id = generateId();
	export let groupId = getContext('command_groupId') as string | undefined;
	export let shouldRegister = true;
	export let alwaysShow = false;

	let className: $$Props['class'] = undefined;
	export { className as class };

	const {
		state: { selectedValue, activeValue, activeElement, inputValue, filtered },
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
		actions.closeMenu();
	}

	// TODO: add way to not close
	function handleSelect(e: Event) {
		if (disabled) return;
		onSelect(value);
		if (
			!e.defaultPrevented &&
			(e instanceof MouseEvent || e instanceof PointerEvent) &&
			// check to make sure we didn't click a checkbox
			!(e.target instanceof HTMLInputElement && e.target.type === 'checkbox')
		) {
			actions.closeMenu();
		}
	}

	onMount(() => {
		if (node) {
			node.addEventListener(SELECT_EVENT_NAME, handleSelect);
			value = value || node.textContent?.trim()?.toLowerCase() || '';
		}

		let unmount = () => {};
		if (shouldRegister) {
			unmount = helpers.registerItem(id, groupId);
			helpers.registerItemValue(id, value);
		}

		return () => {
			if (node) {
				node.removeEventListener(SELECT_EVENT_NAME, handleSelect);
			}
			unmount();
		};
	});

	$: render = alwaysShow || !$inputValue || $filtered.items.includes(id);
</script>

{#if render}
	<button
		class={cn(
			!unstyled &&
				'relative text-left flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className
		)}
		bind:this={node}
		{id}
		aria-disabled={disabled ? true : undefined}
		data-disabled={disabled ? '' : undefined}
		aria-selected={$selectedValue.includes(value)}
		data-value={value}
		role="option"
		on:pointermove={handlePointerMove}
		on:click={handleClick}
		data-highlighted={$activeElement === node ? '' : undefined}
	>
		<!--  -->
		<slot />
	</button>
{/if}
