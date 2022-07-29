<script lang="ts">
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';

	import { createEventDispatcher, getContext, onDestroy } from 'svelte';
	import { onMount } from 'svelte';
	import type { navStore as INavStore } from './KeyboardNav.svelte';
	export let as: string;
	export let attrs: { [key: string]: string | boolean | undefined | number } | undefined =
		undefined;
	let className = '';
	export { className as class };
	export let index: number;
	const navStore: typeof INavStore = getContext('navStore');
	let el: HTMLElement | undefined;
	onMount(() => {
		el && navStore.addItem(el);
	});
	onDestroy(() => {
		el && navStore.removeItem(el);
	});
	$: index = el ? $navStore.items.indexOf(el) : -2;
	$: active = el && $navStore.activeIndex === index;
	$: active, active && dispatch('active');
	$: el && active && el.scrollIntoView({ block: 'nearest' });

	const dispatch = createEventDispatcher();
	function handleKeydown(e: KeyboardEvent) {
		if ($disableGlobalKeyboardShortcuts) return;
		if (e.key !== 'Enter') return;
		if (!active) return;
		e.preventDefault();
		dispatch('select');
	}

	function handleMove(e: PointerEvent | MouseEvent) {
		if (!el) return;
		navStore.setActive(el);
	}
</script>

<svelte:window on:keydown={$navStore.active ? handleKeydown : undefined} />

<svelte:element
	this={as}
	on:mousemove={$navStore.changeActiveOnHover && $navStore.active ? handleMove : undefined}
	bind:this={el}
	class={className}
	tabindex="-1"
	{...attrs}
>
	<slot {active} /></svelte:element
>
