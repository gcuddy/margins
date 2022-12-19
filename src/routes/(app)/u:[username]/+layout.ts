import { writable } from 'svelte/store';

import { createCachedValue } from '$lib/cache';
import type { ICurrentList } from '$lib/stores/currentList';

import type { LayoutLoad } from './$types';
export const load: LayoutLoad = async ({ fetch, depends, data }) => {
	//q: does this work with store in ssr?
	// console.log(`(app)/layout.ts load function`);
	// depends('app:user');
	// const res = await fetch('/api/user.json');
	// const user = await res.json();
	return {
		...data,
		// user,
		// currentList: writable<ICurrentList>(),
		currentList: createCachedValue('currentList', () => writable<ICurrentList>()),
	};
};
