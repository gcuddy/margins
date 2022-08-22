import type { ComponentProperties } from '$lib/stores/types';
import { writable } from 'svelte/store';
import type GenericCommandPalette from './GenericCommandPalette.svelte';

function createCommandPaletteStore<TValue>() {
	type T = ComponentProperties<GenericCommandPalette>;

	interface State {
		isOpen: boolean;
		props?: ComponentProperties<GenericCommandPalette>;
	}
	const { subscribe, set, update } = writable<State>({
		isOpen: false
	});
	// TODO: fix types so that when you pass in something to values in props, it works (all the other props are from that generic)
	function open<T>(props: State['props'], open = true) {
		console.log('recived open request');
		update((state) => {
			state.isOpen = open;
			state.props = props;
			return state;
		});
	}
	return {
		open,
		subscribe,
		set,
		update
	};
}

export const commandPaletteStore = createCommandPaletteStore();
