import { writable } from 'svelte/store';

export function make_state<TValue extends {}, TKey extends keyof TValue>(id: TKey) {
	const { update, subscribe, set } = writable({} as Record<TValue[TKey], TValue>);

	const init = (items: TValue[]) => {
		update((lookup) => {
			for (const item of items) {
				if (!lookup[item[id]]) {
					lookup[item[id]] = item;
				}
			}

			return lookup;
		});
	};

	const update_item = (id: TValue[TKey], item: Partial<TValue>) => {
		update((lookup) => {
			lookup[id] = {
				...lookup[id],
				...item
			};
			return lookup;
		});
	};

	return { subscribe, init, update_item };
}
