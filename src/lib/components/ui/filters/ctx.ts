import { filterLibrarySchema } from '$lib/schemas/library';
import {
	createSearchParamsStore,
	setSearchParamsStoreContext,
	createSearchParamsStoreContextGetter,
	SearchParamsStore
} from '$lib/stores/search-params';
import { getContext, setContext } from 'svelte';
import { derived, writable } from 'svelte/store';

//

const NAME = Symbol('filterStore');

export function set() {
	const filterStore = createSearchParamsStore(filterLibrarySchema);

	const ctx = {
		state: {
			filterStore,
			hasFilters: derived(filterStore, ($filterStore) => {
				return Object.keys($filterStore).length > 0;
			})
		},
		elements: {
			container: writable<HTMLElement | null>(null)
		}
	};
	setContext(NAME, ctx);
	return ctx;
}

export function get() {
	return getContext<ReturnType<typeof set>>(NAME);
}

export const ctx = {
	get,
	set
};
