import { getContext, setContext } from 'svelte';
import { derived, writable, get as sget } from 'svelte/store';

import { FilterLibrarySchema, filterLibrarySchema } from '$lib/schemas/library';
import { createFilterDialogStore } from '$lib/stores/filters';
import { createSearchParamsStore } from '$lib/stores/search-params';
import { createChangeSearch } from '$lib/utils/search-params';
import { objectEntries } from '$lib/helpers';
import { page } from '$app/stores';

//

const NAME = Symbol('filterStore');

export function set() {
	const filterStore = createSearchParamsStore(filterLibrarySchema);
	const dialogStore = createFilterDialogStore();

	const filterChange = createChangeSearch<FilterLibrarySchema>();

	// same function as before, but you don't need to pass the store
	const navigateSearch = (params: Parameters<typeof filterChange>[1]) => {
		const $page = sget(page);
		filterChange($page.url, params);
	};

	const ctx = {
		elements: {
			container: writable<HTMLElement | null>(null),
		},
		helpers: {
			filterChange: createChangeSearch<FilterLibrarySchema>(),
			navigateSearch,
		},
		state: {
			dialogStore,
			filterStore,
			filters: derived(filterStore, ($filterStore) => {
				return objectEntries($filterStore).filter(Boolean);
			}),
			hasFilters: derived(filterStore, ($filterStore) => {
				return Object.keys($filterStore).length > 0;
			}),
			open: writable(false),
		},
	};
	setContext(NAME, ctx);
	return ctx;
}

export function get() {
	return getContext<ReturnType<typeof set>>(NAME);
}

export const ctx = {
	get,
	set,
};
