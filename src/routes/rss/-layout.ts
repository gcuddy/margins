import type { LayoutLoad } from '../../../.svelte-kit/types/src/routes/rss/$types';
export const load: LayoutLoad = async ({ fetch, url }) => {
	const response = await fetch('/rss/feeds.json', {
		method: 'GET'
	});
	const { feeds } = await response.json();
	const filter = url.searchParams.get('filter');
	return {
		filter,
		feeds
	};
};
