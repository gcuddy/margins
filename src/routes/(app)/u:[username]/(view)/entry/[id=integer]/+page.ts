import { error } from '@sveltejs/kit';
import { type Writable, get } from 'svelte/store';

import type { EntryWithAnnotations } from '$lib/entry.server';
import type { ICurrentList } from '$lib/stores/currentList';

import type { PageLoad } from './$types';

const getItemFromList = (currentList: Writable<ICurrentList>, entryId: number) => {
	const $currentList = get(currentList);
	console.log({ $currentList });
	if (!$currentList) return;
	if ($currentList.type === 'rss') {
		return $currentList.items.find((item) => item.id === Number(entryId));
	} else if ($currentList.type === 'bookmarks') {
		// then these are annotations... let's massage the list to get the entry
		$currentList.items.map((item) => {
			return {
				...item.entry,
				annotations: item,
			};
		});
		return $currentList.items.find((item) => item.entryId === entryId);
	}
};

export const load: PageLoad = async ({ fetch, params, parent, depends }) => {
	// fetch entry
	// TODO: check cache first (maybe use a store? for now using a map (cache)^)

	console.time(`entry:${params.id}`);
	depends(`entry:${params.id}`);
	// TODO: but how to invalidate it?
	// TODO: the better way to do this is to to use the root layout store

	// instead: check if currentlist exists. if it does, return that. otherwise, if it can't be found, fetch it.
	// const entry = await createCachedValue(`entry:${params.id}`, async () => {
	// 	const res = await fetch(`/api/entries/${params.id}`);
	// 	const entry: EntryWithAnnotations = await res.json();
	// 	return entry;
	// });

	const data = await parent();
	// TODO: with annotations
	// TODO: better way to indicate if data dirty... for example if currentlist more than x seconds old or something
	let entry: EntryWithAnnotations | undefined = undefined;
	if (data.currentList) {
		const item = getItemFromList(data.currentList, Number(params.id));
		if (item && 'entry' in item && item.entry) {
			entry = item.entry;
		} else if (item && 'annotations' in item) {
			entry = item;
		}
	}

	if (!entry) {
		// fetch
		const res = await fetch(`/api/entries/${params.id}`);
		entry = await res.json();
	}
	const stylesheet = data.user?.stylesheets?.find((stylesheet) => {
		// const regex = new RegExp(stylesheet.domain, 'i');
		if (!entry?.uri) {
			return false;
		}
		return entry?.uri.includes(stylesheet.domain);
		// return regex.test(article.uri);
	});

	// if (article.userId !== session?.userId && article.private) {
	// 	throw error(401, 'Unauthorized');
	// }
	// // TODO: public article but viewing from different user/anonymous
	if (!entry) {
		throw error(404, 'Entry not found');
	}
	console.timeEnd(`entry:${params.id}`);

	// should just be the one, right?
	const interaction = entry.interactions[0];
	return {
		...data,
		article: entry,
		interaction,
		stylesheet,
	};
};
