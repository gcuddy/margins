<script lang="ts">
	import type { Action } from '$lib/actions/types';

	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { NavState } from './KeyboardNav.svelte';
	const dispatch = createEventDispatcher();
	export let as = 'div';
	export let attrs: { [key: string]: string | boolean | undefined | number } | undefined =
		undefined;

	/** Currently we require an index to be passed in —
	 * is there another way to get the "index" in the list without being passed in?
	 */
	export let index: number;

	interface Slot {
		active: boolean;
		followTabIndex: Action;
	}
	interface $$Slots {
		default: Slot;
	}

	$: active = !!$navStore.active?.isEqualNode($navStore.els[index]);

	let className: string | ((props: Pick<Slot, 'active'>) => string) = '';
	export { className as class };
	$: computedClass = typeof className === 'function' ? className({ active }) : className;

	export let href: string | undefined = undefined;

	const navStore: Writable<NavState> = getContext('navStore');
	let el: HTMLElement | undefined;

	let child_elements: HTMLElement[] = [];

	// this is an ACTION that can be passed down to other child elements; they will follow the same tabindex logic
	const followTabIndex: Action = (node: HTMLElement) => {
		child_elements = [...child_elements, node];
		node.tabIndex = -1;
		return {
			destroy: () => {
				child_elements = child_elements.filter((e) => e !== node);
			}
		};
	};

	function handleMove(e: PointerEvent | MouseEvent) {
		if (!el) return;
	}

	function setUpFocus(e: FocusEvent) {
		// this is called when an anchor element gets focused, we start our roving tabindex focus controller
		const target = e.target as HTMLElement;
		$navStore.els.forEach((item) => {
			if (item) {
				item.tabIndex = -1;
			}
		});
		console.log({ $navStore, child_elements });
		child_elements.forEach((item) => {
			if (item) {
				item.tabIndex = 0;
			}
		});
		target.tabIndex = 0;
		target.focus();
		// now remove the event listeners
		$navStore.els.forEach((item) => {
			if (item) item.removeEventListener('focus', setUpFocus);
		});
	}
	function handleBlur(e: FocusEvent) {
		child_elements.forEach((item) => {
			if (item) {
				item.tabIndex = -1;
			}
		});
	}

	const setActive = (el: HTMLElement) => {
		// set target to new active Element
		$navStore.active = el;

		// change tabindex
		$navStore.els.forEach((item: HTMLElement) => {
			if (item) {
				item.tabIndex = -1;
			}
		});
		child_elements.forEach((item) => {
			if (item) {
				item.tabIndex = 0;
			}
		});

		$navStore.active.tabIndex = 0;
	};

	function handleFocus(e: FocusEvent) {
		const target = e.target as HTMLElement;
		// remove previous focus-within class
		// list.querySelector('.saved-image.focus-within')?.classList.remove('focus-within');

		// set target to new active Element
		$navStore.active = target;

		// change tabindex
		$navStore.els.forEach((item) => {
			if (item) {
				item.tabIndex = -1;
			}
		});
		child_elements.forEach((item) => {
			if (item) {
				item.tabIndex = 0;
			}
		});

		$navStore.active.tabIndex = 0;

		// add .focus-within to parent div
		// active.closest('.saved-image').classList.add('focus-within');
	}

	function handleKeydown(e: KeyboardEvent) {
		console.log({ e });
		if (e.key === 'x') {
			dispatch('select');
		}
		if (e.key === 'Enter') {
			// have to do this because svelte-dnd-action doesn't play nice with us
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	}
	$: console.log({ index, el });
	$: $navStore.els[index] = el;
</script>

<!-- <svelte:window on:keydown={$navStore.active ? handleKeydown : undefined} /> -->

<!-- not sure fi this onfocus will work -->
<!-- {index} -->
{#if as === 'a'}
	<a
		on:mousemove={$navStore.changeActiveOnHover && $navStore.active ? handleMove : undefined}
		{href}
		bind:this={el}
		on:focus|once={setUpFocus}
		on:focus={handleFocus}
		on:keydown={handleKeydown}
		on:focus
		on:focusin={() => {
			if (!el) return;
			setActive(el);
		}}
		on:blur={handleBlur}
		on:blur
		on:mouseover
		on:mouseleave
		sveltekit:prefetch
		on:click={(e) => {
			$navStore.active = $navStore.els[index];
		}}
		on:click
		class={computedClass}
		{...$$restProps}
		{...attrs}
	>
		<slot {followTabIndex} active={!!$navStore.active?.isEqualNode($navStore.els[index])} /></a
	>
{:else}
	<svelte:element
		this={as}
		on:mousemove={$navStore.changeActiveOnHover && $navStore.active ? handleMove : undefined}
		bind:this={el}
		on:focus|once={setUpFocus}
		on:focus={handleFocus}
		on:keydown={handleKeydown}
		on:focus
		on:focusin={() => {
			if (!el) return;
			setActive(el);
		}}
		on:blur={handleBlur}
		on:blur
		on:mouseover
		on:mouseleave
		on:click={(e) => {
			$navStore.active = $navStore.els[index];
		}}
		on:click
		class={computedClass}
		{...$$restProps}
		{...attrs}
	>
		<slot
			{followTabIndex}
			active={!!$navStore.active?.isEqualNode($navStore.els[index])}
		/></svelte:element
	>
{/if}
