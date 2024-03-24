import { derived, writable } from 'svelte/store';

function checked_entry_store() {
	const { set, subscribe, update } = writable<Record<string, boolean>>({});

	return {
		clear: () => set({}),
		set,
		subscribe,
		update,
	};
}

export const checkedEntries = checked_entry_store();

export const checkedEntryIds = (() => {
	// const { subscribe } = derived(checkedEntries, ($entries) => {
	// 	return Object.keys($entries)
	// 		.filter((id) => $entries[id])
	// 		.map((id) => parseInt(id, 10));
	// });
	const state = writable<Array<number>>([]);
	return {
		...state,
		clear: () => state.set([]),
	};
})();

