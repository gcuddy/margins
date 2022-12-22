import { browser } from '$app/environment';
import type { User } from '$lib/stores/user';
import { user } from '$lib/stores/user';
import { get, writable } from 'svelte/store';

import { currentList } from '../store';
import type { LayoutLoad } from './$types';
export const load: LayoutLoad = async ({ data, parent, params, fetch, url }) => {
	// const { user } = await parent();
	// vs importing?
	let userStore: User;
	const d = await parent();
	console.log({ d });

	if (browser && get(currentList) && url.pathname !== `/rss/${params.id}`) {
		return {
			currentList,
		};
	}
	if (browser) {
		userStore = get(user);
	}
	if (browser && (userStore = get(user))) {
		// const userStore = get(user);
		console.log({ userStore });
		const feed = userStore?.feeds?.find((f) => f.id === Number(params.id));
		let items = userStore?.feedItems?.filter((i) => i.id === Number(params.id)) || [];
		// // console.log({ items });
		const res = await fetch(
			`/rss/${params.id}/entries.json?have=${items.map((i) => i.id).join(',')}`
		);
		// console.log({ res });
		const fetchedData = await res.json();
		items = [...items, ...fetchedData.items];
		// user.update((u) => {
		// 	items.forEach((item) => {
		// 		// prevent duplicates
		// 		u.feedItems = u.feedItems?.filter((i) => i.id !== item.id);
		// 		u.feedItems?.push(...items);
		// 	});
		// 	return u;
		// });

		return {
			items,
			cursor: fetchedData.cursor,
			feed,
			currentList,
		};
	}
	const [itemsInfo, feed] = await Promise.all([
		fetch(`/rss/${params.id}/entries.json`).then((res) => res.json()),
		fetch(`/rss/${params.id}/data.json`).then((res) => res.json()),
	]);
	return {
		items: itemsInfo.items,
		cursor: itemsInfo.cursor,
		feed,
		currentList: writable({
			href: `/rss/${params.id}`,
			items: itemsInfo.items,
			title: feed?.title || 'Feed',
		}),
	};
};
