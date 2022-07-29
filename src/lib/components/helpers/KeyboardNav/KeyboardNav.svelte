<script lang="ts" context="module">
	interface NavState {
		items: HTMLElement[];
		activeIndex: number;
		changeActiveOnHover: boolean;
		active: boolean;
	}

	function createNavStore() {
		const state: NavState = {
			items: [],
			activeIndex: -1,
			changeActiveOnHover: true,
			active: true
		};
		const { subscribe, set, update } = writable(state);
		return {
			subscribe,
			set,
			update,
			setActive: (item: HTMLElement) => {
				update((state) => {
					state.activeIndex = state.items.indexOf(item);
					return state;
				});
			},
			addItem: (item: HTMLElement) => {
				update((state) => {
					state.items.push(item);
					return state;
				});
			},
			addItemAtIndex: (item: HTMLElement, index: number) => {
				update((state) => {
					state.items.splice(index, 0, item);
					return state;
				});
			},
			removeItem: (item: HTMLElement) => {
				update((state) => {
					state.items = state.items.filter((i) => i !== item);
					return state;
				});
			}
		};
	}
	export const navStore = createNavStore();
</script>

<script lang="ts">
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';

	import { setContext } from 'svelte';

	import { writable } from 'svelte/store';

	setContext('navStore', navStore);

	let el: HTMLElement | undefined;
	export let changeActiveOnHover = true;
	$: $navStore.changeActiveOnHover = changeActiveOnHover;
	export let active = true;
	$: $navStore.active = active;

	export let activeIndex = -1;
	// $: $navStore.activeIndex = activeIndex;

	// reset when items change (for now)
	// $: $navStore.items.length, ($navStore.activeIndex = -1);

	function handleKeydown(e: KeyboardEvent) {
		if ($disableGlobalKeyboardShortcuts) return;
		switch (e.key) {
			case 'k':
			case 'ArrowUp':
				e.preventDefault();
				$navStore.activeIndex = Math.max(0, $navStore.activeIndex - 1);
				break;
			case 'j':
			case 'ArrowDown':
				e.preventDefault();
				$navStore.activeIndex = Math.min($navStore.items.length - 1, $navStore.activeIndex + 1);
				break;
			case 'Escape':
				e.preventDefault();
				break;
			case 'Enter':
				break;
		}
	}

	$: console.log({ $navStore });
</script>

<svelte:window on:keydown={$navStore.active ? handleKeydown : undefined} />

<!-- Wrapper Item -->
<div bind:this={el}>
	<slot />
</div>
