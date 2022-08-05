<script lang="ts" context="module">
	export interface NavState {
		items: HTMLElement[];
		active: HTMLElement | null;
		changeActiveOnHover: boolean;
		is_enabled: boolean;
		// you can pass in an array or writable array (used with bind:group, for example) which our store will update
		selected_items?: Writable<(string | number)[]> | (string | number)[];
	}
</script>

<script lang="ts">
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';
	import { setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export let opts: Partial<NavState> = {};
	const defaultOpts: NavState = {
		items: [],
		changeActiveOnHover: false,
		active: null,
		is_enabled: true
	};
	const navStore = writable({ ...defaultOpts, ...opts });
	setContext('navStore', navStore);

	let container: HTMLElement | undefined;

	const navigateForward = () => {
		if (!$navStore.items.length) return;
		if (!$navStore.active || !container?.contains($navStore.active)) {
			// if there is no active element, set the first one as active
			// or we'll be here if the element doesn't exist anymore
			$navStore.items[0].focus();
			$navStore.active = $navStore.items[0];
			return;
		}
		const index = $navStore.items.indexOf($navStore.active);
		if (index === -1) return;
		const next = $navStore.items[index + 1];
		if (next) {
			next.focus();
			$navStore.active = next;
		}
	};

	const navigateBackward = () => {
		if (!$navStore.items.length) return;
		if (!$navStore.active || !container?.contains($navStore.active)) {
			// if there is no active element, set the first one as active
			// or we'll be here if the element doesn't exist anymore
			$navStore.items[0].focus();
			$navStore.active = $navStore.items[0];
			return;
		}
		const index = $navStore.items.indexOf($navStore.active);
		const prev = $navStore.items[index - 1];
		if (prev) {
			prev.focus();
			$navStore.active = prev;
		}
	};

	function handleKeydown(e: KeyboardEvent) {
		if ($disableGlobalKeyboardShortcuts) return;
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
	$: $navStore.items = $navStore.items.filter((item) => item);

	// when item length changes, reset
	// $: $navStore.items.length, ($navStore.active = null);
</script>

<svelte:window on:keydown={$navStore.is_enabled ? handleKeydown : undefined} />

<!-- Wrapper Item -->
<div bind:this={container}>
	<slot />
</div>
