import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params, url }) => {
	const data = await parent();

	console.log('id _page.ts', data);
	// data.currentList.set({
	// 	type: 'rss',
	// 	back: 'test',
	// });
	// if (browser)
	return {
		...data,
	};
};
