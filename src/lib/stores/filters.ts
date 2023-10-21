import { writable } from 'svelte/store';

import type { FilterLibrarySchema } from '$lib/schemas/library';

function createFilterStore() {
	const filter: FilterLibrarySchema = {};

	const store = writable<FilterLibrarySchema>({});

	const searchStr = '';

	return {
		add: (filter: Partial<FilterLibrarySchema>) => {
			store.update((val) => {
				return { ...val, ...filter };
			});
		},
	};
}

type FilterDialogStoreProps = {
	action?: (value: string) => void;
	open: boolean;
	title?: string;
	type?: 'text';
	value?: string;
};

export function createFilterDialogStore() {
	const filterDialogStore = writable<FilterDialogStoreProps>({
		open: false,
	});

	return {
		...filterDialogStore,
		action: (reset = true) => {
			filterDialogStore.update((val) => {
				console.log('action', { val });
				if (val.action) {
					val.action(val.value ?? '');
				}
				return {
					...(reset ? {} : val),
					open: false,
				};
			});
		},
		open: (props: Omit<FilterDialogStoreProps, 'open'>) => {
			filterDialogStore.set({
				open: true,
				...props,
			});
		},
		reset: () => {
			filterDialogStore.set({
				open: false,
			});
		},
	};
}
