import { writable } from 'svelte/store';

export function createFocusStore(elements: HTMLElement[]) {
	const { subscribe, set, update } = writable({
		index: -1,
		elements
	});

	const next = () => {
		update((f) => {
			f.index = f.index++;
			f.elements[f.index].focus();
			return f;
		});
	};

	return {
		subscribe,
		set,
		update,
		next
	};
}
