import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.episode_id);
	const episode = await db.rssFeedItem.findFirst({
		where: {
			id,
		},
		include: {
			feed: true,
		},
	});
	console.log({ episode });
	return {
		...episode,
	};
};
