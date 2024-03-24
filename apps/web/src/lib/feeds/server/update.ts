import { db } from '$lib/db';
import { getPodcastFromURL } from '../podcast-parser';
import pindex from '$lib/api/pindex';

export async function update() {
	// go through all podcast subscriptions

	const podcasts = await db
		.selectFrom('Feed')
		.where('podcast', '=', 1)
		.select(['podcastIndexId', 'id', 'feedUrl'])
		.limit(1)
		.execute();
	for (const podcast of podcasts.slice(0, 1)) {
		if (podcast.podcastIndexId) {
			const episodes = await pindex.episodesByFeedId(podcast.podcastIndexId);
			console.dir({ episodes }, { depth: null });
		}
	}
}
