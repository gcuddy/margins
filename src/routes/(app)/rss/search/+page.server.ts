import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ url, parent }) => {
	const data = await parent();
	const q = url.searchParams.get('q');
	console.log({ q });
	if (!q) {
		return {
			results: [],
		};
	}
	const results = await db.rssFeedItem.findMany({
		where: {
			content: {
				search: q,
			},
			title: {
				search: q,
			},
		},
	});
	return {
		results,
		...data,
	};
};
