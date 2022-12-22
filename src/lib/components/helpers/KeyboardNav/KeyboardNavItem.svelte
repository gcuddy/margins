<script lang="ts">
	import type { Action } from '$lib/actions/types';
	import { getContext, onDestroy, onMount, tick } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import { useKeyboardNavContext, type NavState } from './KeyboardNav.svelte';
	import { useId } from '$lib/hooks/use-id';
	import { Focus } from '$lib/utils/calculate-active-index';

	interface Slot {
		active: boolean;
		followTabIndex: Action;
	}
	interface $$Slots {
		default: Slot;
	}

	const dispatch = createEventDispatcher();
	let el: HTMLElement | null = null;
	let api = useKeyboardNavContext('KeyboardNavItem');

	export let as = 'div';
	export let href: string | undefined = undefined;
	export let id = `keyboard-nav-item-${useId()}`;
	export let disabled = false;

	$: active = $api.activeIndex !== null ? $api.items[$api.activeIndex]?.id === id : false;
	$: console.log({ active, activeIndex: $api.activeIndex });
	onMount(() =>
		$api.registerOption(id, {
			disabled,
			domRef: el,
		})
	);
	onDestroy(() => $api.unregisterOption(id));

	let oldActive = active;
	async function updateFocus(newActive: boolean) {
		// Wait for a tick since we need to ensure registerOption has been applied
		await tick();
		if (newActive !== oldActive) {
			if (newActive) {
				const el = document.getElementById(id);
				el?.scrollIntoView?.({ block: 'nearest' });
				el?.focus();
			}
		}
		oldActive = newActive;
	}
	$: updateFocus(active);

	let className: string | ((props: Pick<Slot, 'active'>) => string) = '';
	export { className as class };
	$: computedClass = typeof className === 'function' ? className({ active }) : className;

	let child_elements: HTMLElement[] = [];

	const followTabIndex: Action = (node: HTMLElement) => {
		child_elements = [...child_elements, node];
		node.tabIndex = -1;
		return {
			destroy: () => {
				child_elements = child_elements.filter((e) => e !== node);
			},
		};
	};

	function handleMove(e: PointerEvent | MouseEvent) {
		if (!$api.changeActiveOnHover) return;
		if (disabled) return;
		if (active) return;
		$api.goToOption(Focus.Specific, id);
		dispatch('active');
	}
	function handleLeave() {
		if (!$api.changeActiveOnHover) return;
		if (disabled) return;
		if (!active) return;
		$api.goToOption(Focus.Nothing);
		dispatch('active');
	}

	function handleFocus() {
		if (disabled) return $api.goToOption(Focus.Nothing);
		$api.goToOption(Focus.Specific, id);
		dispatch('active');
	}
	async function handleClick(e: MouseEvent) {
		if (disabled) return e.preventDefault();
		$api.goToOption(Focus.Specific, id);
		dispatch('active');
	}

	function handleKeydown(e: KeyboardEvent) {
		// console.log({ e });
		if (e.key === 'x') {
			dispatch('select');
		}
		if (e.key === 'Enter') {
			// have to do this because svelte-dnd-action doesn't play nice with us
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	}

	$: propsWeControl = {
		id,
		tabIndex: disabled === true ? undefined : active ? 0 : -1,
		'aria-disabled': disabled === true ? true : undefined,
	};
</script>

<!-- <svelte:window on:keydown={$navStore.active ? handleKeydown : undefined} /> -->

<svelte:element
	this={as}
	bind:this={el}
	{href}
	on:click={handleClick}
	on:focus={handleFocus}
	on:keydown={handleKeydown}
	on:mousemove={handleMove}
	on:pointermove={handleMove}
	on:mouseleave={handleLeave}
	on:pointerleave={handleLeave}
	class={computedClass}
	{...propsWeControl}
	{...$$restProps}
>
	<slot {followTabIndex} {active} /></svelte:element
>
