<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { NavState } from './KeyboardNav.svelte';

	export let as = 'div';
	export let attrs: { [key: string]: string | boolean | undefined | number } | undefined =
		undefined;

	/** Currently we require an index to be passed in —
	 * is there another way to get the "index" in the list without being passed in?
	 */
	export let index: number;

	let className = 'focus:ring';
	export { className as class };

	const navStore: Writable<NavState> = getContext('navStore');
	let el: HTMLElement | undefined;

	function handleMove(e: PointerEvent | MouseEvent) {
		if (!el) return;
	}

	function setUpFocus(e: FocusEvent) {
		// this is called when an anchor element gets focused, we start our roving tabindex focus controller
		const target = e.target as HTMLElement;
		$navStore.items.forEach((item) => {
			if (item) {
				item.tabIndex = -1;
			}
		});
		target.tabIndex = 0;
		target.focus();
		// now remove the event listeners
		$navStore.items.forEach((item) => {
			if (item) item.removeEventListener('focus', setUpFocus);
		});
	}

	function handleFocus(e: FocusEvent) {
		const target = e.target as HTMLElement;
		// remove previous focus-within class
		// list.querySelector('.saved-image.focus-within')?.classList.remove('focus-within');

		// set target to new active Element
		$navStore.active = target;

		// change tabindex
		$navStore.items.forEach((item) => {
			if (item) {
				item.tabIndex = -1;
			}
		});

		$navStore.active.tabIndex = 0;

		// add .focus-within to parent div
		// active.closest('.saved-image').classList.add('focus-within');
	}
</script>

<!-- <svelte:window on:keydown={$navStore.active ? handleKeydown : undefined} /> -->

<!-- not sure fi this onfocus will work -->
<svelte:element
	this={as}
	on:mousemove={$navStore.changeActiveOnHover && $navStore.active ? handleMove : undefined}
	bind:this={$navStore.items[index]}
	on:focus|once={setUpFocus}
	on:focus={handleFocus}
	on:click={(e) => {
		$navStore.active = $navStore.items[index];
	}}
	on:click
	class={className}
	{...$$props}
	{...attrs}
>
	<slot /></svelte:element
>
