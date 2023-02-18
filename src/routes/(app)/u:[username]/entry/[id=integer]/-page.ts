import { error } from '@sveltejs/kit';
import { type Writable, get } from 'svelte/store';

import type { EntryWithBookmark } from '$lib/entry.server';
import type { ICurrentList } from '$lib/stores/currentList';
import { trpc } from '$lib/trpc/client';

import type { PageLoad, PageLoadEvent } from './$types';
import type { Entry } from '@prisma/client';
import type { RouterOutputs } from '$lib/trpc/router';

const getItemFromList = (currentList: Writable<ICurrentList>, entryId: number) => {
	const $currentList = get(currentList);
	console.log({ $currentList });
	if (!$currentList) return;
	const entry = $currentList.items?.find((item) => item.id === Number(entryId));
	return entry;
};

const updateItemFromList = (currentList: Writable<ICurrentList>, entryId: number, data: Partial<ICurrentList['items'][number]>) => {
	currentList.update(($currentList) => {
		if (!$currentList?.items) return $currentList
		const idx = $currentList.items.findIndex(item => item.id === entryId);
		if (idx < 0) return $currentList
		$currentList.items[idx] = { ...$currentList.items[idx], ...data };
		return $currentList
	})
}

// export const load = (async ({ data, parent }) => {
// 	// TODO: cache current list
// 	const d = await parent();
// 	return {
// 		...data,
// 		...d,
// 	}

// }) satisfies PageLoad

export const _load: OldPageLoad = async (event) => {
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
	let entry: Partial<RouterOutputs["entries"]["load"]> | undefined = undefined;
	entry = data.allEntries?.find(a => a.id === +params.id)

	if (!entry && "currentList" in data) {
		entry = getItemFromList(data.currentList, Number(params.id));
		// if (item && 'annotations' in item) {
		// 	entry = item;
		// } else {
		// 	entry = item;
		// }
	}

	if (!entry) {
		// todo: trpc here on server
		entry = await trpc(event).entries.load.query({
			id: +params.id
		})
		// const res = await fetch(`/api/entries/${params.id}`);
		// entry = await res.json();
		console.log(`fetched entry`, { entry });
	}
	const stylesheet = data.stylesheets?.find((stylesheet) => {
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

	// should just be the one, right?
	const interaction = {};
	console.log({ entry });
	// let html = entry.html;
	const id = +params.id;
	// TODO: should annotations get moved to page.svelte for faster loading? (required js but also that's ok)
	let { html, annotations, context } = entry
	if (!html || !annotations) {
		console.log({ context, html, annotations })
		const loadedData = await trpc(event).entries.loadData.query({
			id,
			data: {
				content: !html,
				annotations: !entry.annotations,
			},
		});
		if (!html) html = loadedData.data?.html || loadedData.html || null;
		if (!annotations) annotations = loadedData.annotations || [];


		console.log({ html, annotations });

		// Update Current List with HTML, so that it's stored in memory and doesn't have to be refetched if we navigate to it again soon (eg by using next/prev buttons)
		if (data.currentList && !entry.html && html) {
			updateItemFromList(data.currentList, entry.id, { html, annotations })
		}
	}


	console.timeEnd(`entry:${params.id}`);
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
