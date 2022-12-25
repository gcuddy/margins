import { trpc } from '$lib/trpc/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	const { parent, params, url } = event;
	// data.currentList.set({
	// 	type: 'rss',
	// 	back: 'test',
	// });
	// if (browser)
	const entries = await trpc(event).subscriptions.loadEntries.query({
		feedId: +params.id
	})
	const data = await parent();
	const subscription = data.subscriptions.filter(s => s.feedId === +params.id)
	console.log('id _page.ts', data);
	return {
		...data,
		subscription,
		entries
	};
};
