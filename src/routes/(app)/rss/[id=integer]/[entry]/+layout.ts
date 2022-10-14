import { browser } from '$app/environment';
import idb from '$lib/idb';
import { get } from 'svelte/store';
import { currentList } from '../../store';
import type { LayoutLoad } from './$types';
export const load: LayoutLoad = async ({ params, parent, fetch, url }) => {
	const entry = params.entry;
	const data = await parent();
	console.log({ data });
	const list = get(currentList);
	const item = (list || data)?.items.find((item) => item.uuid === entry);
	if (browser) {
		console.log({ idb });
	}
	console.log({ item });
	fetch(`/rss/${params.id}/${params.entry}/mark_as_read`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((res) => console.log(res.ok));
	if (item) {
		item.is_read = true;
	}
	return {
		item,
		url: url.pathname,
	};
};
