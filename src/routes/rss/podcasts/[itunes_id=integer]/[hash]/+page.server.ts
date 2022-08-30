import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async ({ params }) => {
	const { hash } = params;
	try {
		const episode = await db.podcastEpisode.findFirst({
			where: {
				hash,
			},
			include: {
				podcast: true,
				PodcastEpisodeInteraction: true,
			},
		});
		return {
			episode,
		};
	} catch (e) {
		throw error(404, 'Episode not found');
	}
};
