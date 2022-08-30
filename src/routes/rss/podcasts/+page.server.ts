import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	const podcasts = await db.rssFeed.findMany({
		where: {
			podcast: true,
		},
	});
	return {
		podcasts,
	};
};
