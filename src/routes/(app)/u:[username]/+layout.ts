import { writable } from 'svelte/store';

import { createCachedValue } from '$lib/cache';
import type { ICurrentList } from '$lib/stores/currentList';

import type { LayoutLoad } from './$types';
export const load: LayoutLoad = async ({ fetch, depends, data }) => {
	// TODO: should I not put this here??
	const res = await fetch(`/api/v1/tags.json`);
	// todo: error handling
	const tags = await res.json();
	console.log({ tags });
	return {
		currentList: createCachedValue('currentList', () => writable<ICurrentList>()),
		tags,
	};
};
