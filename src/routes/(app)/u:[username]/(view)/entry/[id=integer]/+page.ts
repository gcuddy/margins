import { error } from '@sveltejs/kit';
import { type Writable, get } from 'svelte/store';

import type { EntryWithBookmark } from '$lib/entry.server';
import type { ICurrentList } from '$lib/stores/currentList';
import { trpc } from '$lib/trpc/client';

import type { PageLoad } from './$types';

const getItemFromList = (currentList: Writable<ICurrentList>, entryId: number) => {
	const $currentList = get(currentList);
	console.log({ $currentList });
	if (!$currentList) return;
	const entry = $currentList.items?.find((item) => item.id === Number(entryId));
	return entry;
};
export const load: PageLoad = async (event) => {
	const { fetch, params, parent, depends, data: serverData } = event;
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

	//TODO: fix this type to be inferred from trpc
	let entry: EntryWithBookmark | undefined = undefined;
	if (data.currentList) {
		entry = getItemFromList(data.currentList, Number(params.id));
		// if (item && 'annotations' in item) {
		// 	entry = item;
		// } else {
		// 	entry = item;
		// }
	}

	if (!entry) {
		// todo: trpc here on server
		const res = await fetch(`/api/entries/${params.id}`);
		entry = await res.json();
		console.log(`fetched entry`, { entry });
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
	const interaction = {};
	console.log({ entry });
	// let html = entry.html;
	const id = +params.id;
	// TODO: should annotations get moved to page.svelte for faster loading? (required js but also that's ok)
	let html = entry.html;
	let annotations = entry.annotations;
	if (!html || !annotations) {
		const data = await trpc(event).entries.loadData.query({
			id,
			data: {
				html: !entry.html,
				annotations: !entry.annotations,
			},
		});
		html = data.html || null;
		annotations = data.annotations || [];
		console.log({ html, annotations });
	}

	return {
		...data,
		...serverData,
		article: {
			...entry,
			html,
			annotations,
		},
		interaction,
		stylesheet,
	};
};
