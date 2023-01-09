import { get, writable } from 'svelte/store';

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

export const checkIfKeyboardShortcutsAllowed = () => {
	if (get(disableGlobalKeyboardShortcuts)) return false;
	const a = document.activeElement;
	if (a instanceof HTMLTextAreaElement || a instanceof HTMLInputElement) {
		return false;
	}
	return true
}