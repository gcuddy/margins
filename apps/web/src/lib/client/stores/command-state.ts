import { writable } from 'svelte/store';

function main_command_state() {
	const { set, subscribe, update } = writable({
		open: false,
	});

	return {
		close: () => update((state) => ({ ...state, open: false })),
		open: () => update((state) => ({ ...state, open: true })),
		run: (fn: () => void) => {
			update((state) => ({ ...state, open: false }));
			fn();
		},
		set,
		subscribe,
		toggle: () => update((state) => ({ ...state, open: !state.open })),
		update,
	};
}

export const mainCommandState = main_command_state();
