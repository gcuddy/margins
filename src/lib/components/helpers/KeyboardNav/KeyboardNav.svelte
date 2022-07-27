<script lang="ts" context="module">
	interface NavState {
		items: HTMLElement[];
		active: HTMLElement | null;
	}

	function createNavStore() {
		const state: NavState = {
			items: [],
			active: null
		};
		const { subscribe, set, update } = writable(state);
		return {
			subscribe,
			setActive: (item: HTMLElement) => {
				update((state) => {
					state.active = item;
					return state;
				});
			},
			addItem: (item: HTMLElement) => {
				update((state) => {
					state.items.push(item);
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
	import { setContext } from 'svelte';

	import { writable } from 'svelte/store';

	setContext('navStore', navStore);

	let el: HTMLElement | undefined;

	function handleKeydown(e: KeyboardEvent) {}

	function handleMove(e: PointerEvent | MouseEvent) {
		const option = e.target as HTMLElement;
		// find the closest option to the event target from the navStore.items
		const closest = $navStore.items.reduce((closest, item) => {
			if (item === option) {
				return item;
			}
			if (closest) {
				return closest;
			}
			if (item.contains(option)) {
				return item;
			}
			return closest;
		}, null);
		console.log({ closest });
	}
</script>

<!-- Wrapper Item -->
<div bind:this={el} on:keydown={handleKeydown} on:pointermove={handleMove}>
	<slot />
</div>
