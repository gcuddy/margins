<script lang="ts" context="module">
	export interface NavState<T> {
		els: HTMLElement[];
		active: HTMLElement | null;
		changeActiveOnHover: boolean;
		is_enabled: boolean;
		items: T[];
		// you can pass in an array or writable array (used with bind:group, for example) which our store will update
		selected_items?: Writable<(string | number)[]> | (string | number)[];
	}
</script>

<script lang="ts">
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';
	import { setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export let opts: Partial<NavState> = {};

	type T = $$Generic;
	export let items: (T & {
		id: string | number;
	})[];
	$: console.log({ items });

	const defaultOpts: NavState<T> = {
		items,
		els: [],
		changeActiveOnHover: false,
		active: null,
		is_enabled: true
	};
	const navStore = writable<NavState<T>>({ ...defaultOpts, ...opts });
	$: items, ($navStore.items = items);
	setContext('navStore', navStore);

	let container: HTMLElement | undefined;

	const navigateForward = () => {
		if (!$navStore.els.length) return;
		if (!$navStore.active || !container?.contains($navStore.active)) {
			// if there is no active element, set the first one as active
			// or we'll be here if the element doesn't exist anymore
			$navStore.els[0].focus();
			$navStore.active = $navStore.els[0];
			return;
		}
		const index = $navStore.els.indexOf($navStore.active);
		if (index === -1) return;
		const next = $navStore.els[index + 1];
		if (next) {
			next.focus();
			$navStore.active = next;
		}
	};

	const navigateBackward = () => {
		if (!$navStore.els.length) return;
		if (!$navStore.active || !container?.contains($navStore.active)) {
			// if there is no active element, set the first one as active
			// or we'll be here if the element doesn't exist anymore
			$navStore.els[0].focus();
			$navStore.active = $navStore.els[0];
			return;
		}
		const index = $navStore.els.indexOf($navStore.active);
		const prev = $navStore.els[index - 1];
		if (prev) {
			prev.focus();
			$navStore.active = prev;
		}
	};

	function handleKeydown(e: KeyboardEvent) {
		console.log('keydown', e.key);
		if ($disableGlobalKeyboardShortcuts) return;
		// if (e.key === 'Tab' && e.shiftKey) {
		// 	e.preventDefault();
		// 	navigateBackward();
		// 	return;
		// } else if (e.key === 'Tab') {
		// 	e.preventDefault();
		// 	navigateForward();
		// 	return;
		// }
		switch (e.key) {
			case 'k':
			case 'ArrowUp':
				e.preventDefault();
				navigateBackward();
				break;
			case 'j':
			case 'ArrowDown':
				e.preventDefault();
				navigateForward();
				break;
			case 'Escape':
				e.preventDefault();
				break;
			case 'Enter':
				break;
		}
	}
	$: console.log({ $navStore });
	$: $navStore.els = $navStore.els.filter((item) => item);

	// when item length changes, reset
	// $: $navStore.items.length, ($navStore.active = null);
</script>

<svelte:window on:keydown={$navStore.is_enabled ? handleKeydown : undefined} />

<!-- Wrapper Item -->
<div bind:this={container}>
	<slot />
</div>
