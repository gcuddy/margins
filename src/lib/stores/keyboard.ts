import { writable } from 'svelte/store';

function createDisableGlobalKeyboardShortcutsStore(initial = false) {
	const { subscribe, set, update } = writable(initial);
	const on = () => {
		console.log('[disableGlobalKeyboardShortcuts] on');
		set(true);
	};
	const off = () => {
		console.log('[disableGlobalKeyboardShortcuts] off');
		set(false);
	};
	const toggle = () => update((v) => !v);
	return {
		subscribe,
		on,
		off,
		toggle
	};
}
export const disableGlobalKeyboardShortcuts = createDisableGlobalKeyboardShortcutsStore();

export const lastKey = writable('');
