import pindex from '$lib/api/pindex';
import { db } from '$lib/db';
export const load = async ({ params, depends }) => {
	const { id } = params;
	if (id.startsWith('p')) {
		// then it's a podcastindex id
		const pid = +id.slice(1);
		const podcast = await pindex.podcastById(pid).then((p) => p.feed);

        depends('podcast');

		const subscription = db
			.selectFrom('Subscription')
			.innerJoin('Feed', 'Feed.id', 'Subscription.feedId')
			.where((eb) =>
				eb.or([
					eb('podcastIndexId', '=', pid),
					eb('Feed.feedUrl', '=', podcast.url),
				]),
			)
			.selectAll('Subscription')
			.executeTakeFirst();
		return {
			// episodes:
			lazy: {
				episodes: pindex.episodesByFeedId(pid).then((p) => p.items),
			},

			podcast,
			subscription,
		};
	} else {
		return {
			podcast: null,
		};
	}
};
