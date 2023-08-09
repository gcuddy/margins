import { derived, writable } from 'svelte/store';

function checked_entry_store() {
	const { subscribe, set, update } = writable<Record<string, boolean>>({});

	return {
		subscribe,
		set,
		update,
		clear: () => set({})
	};
}

export const checkedEntries = checked_entry_store();

export const checkedEntryIds = (() => {
	// const { subscribe } = derived(checkedEntries, ($entries) => {
	// 	return Object.keys($entries)
	// 		.filter((id) => $entries[id])
	// 		.map((id) => parseInt(id, 10));
	// });
    const state = writable<number[]>([]);
	return {
		...state,
		clear: () => state.set([])
	};
})();

