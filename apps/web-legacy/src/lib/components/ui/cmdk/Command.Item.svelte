<script lang="ts">
	import { SELECT_EVENT, useCommand, useState } from './Command.Root.svelte';
	import { useId } from '$lib/hooks/use-id';
	import { getContext, onDestroy } from 'svelte';
	import type { HTMLBaseAttributes } from 'svelte/elements';
	import { writable } from 'svelte/store';

	const id = useId().toString();
	let el: HTMLElement | undefined = undefined;
	const groupId: string = getContext('cmdk_group');
	const context = useCommand();
	const state = useState();

	export let disabled = false;
	export let onSelect: ((value: string) => void) | undefined = undefined;

	export let value: string | undefined = undefined;


	$: value = value || el?.textContent?.trim()?.toLowerCase();

	const _value = writable<string>(value ?? '');

	$: if (value) {
		$context.value(id, value);
		el?.setAttribute('data-value', value);
		$_value = value;
	}

	$: if (el && !disabled) {
		el.addEventListener(SELECT_EVENT, handleSelect);
	}

	$: selected =
		Array.isArray($state.selected) && value
			? $state.selected.includes(value)
			: $state.selected === value;
	$: active = $state.value && $state.value === value;
	$: render =
		$context.filter() === false
			? true
			: !$state.search
			? true
			: ($state.filtered.items.get(id) ?? 0) > 0;

	$: unmounter = $context.item(id, groupId);

	function select() {
		state.setState('value', $_value, true);
		state.setState('active_id', id, true);
	}

	function handleSelect(e: Event) {
		console.log('handle select', e);
		console.log({ $_value });
		state.toggle($_value);
		onSelect?.($_value);
		if (
			!e.defaultPrevented &&
			(e instanceof MouseEvent || e instanceof PointerEvent) &&
			// check to make sure we didn't click a checkbox
			!(e.target instanceof HTMLInputElement)
		) {
			state.close();
		}
	}

	function destroy() {
		if (unmounter) unmounter();
		el?.removeEventListener(SELECT_EVENT, handleSelect);
	}

	onDestroy(destroy);

	interface $$Props extends HTMLBaseAttributes {
		/** Whether this item is currently disabled. */
		disabled?: boolean;
		/** Event handler for when this item is selected, either via click or keyboard selection. */
		onSelect?: (value: string) => void;
		/**
		 * A unique value for this item.
		 * If no value is provided, it will be inferred from `children` or the rendered `textContent`. If your `textContent` changes between renders, you _must_ provide a stable, unique `value`.
		 */
		value?: string;
	}
</script>

<!-- svelte-ignore a11y-interactive-supports-focus -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if render}
	<div
		{id}
		{...$$restProps}
		bind:this={el}
		data-cmdk-item
		role="option"
		aria-selected={selected || undefined}
		data-selected={selected || undefined}
		aria-disabled={disabled || undefined}
		data-active={active || undefined}
		on:pointermove={disabled ? undefined : select}
		on:click={disabled ? undefined : handleSelect}
	>
		<slot {selected} {handleSelect} state={$state} />
	</div>
{/if}
