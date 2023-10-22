import pindex from '$lib/api/pindex';
import { db } from '$lib/db';
export const load = async ({ params, depends, locals }) => {
	const { id } = params;
	if (id.startsWith('p')) {
		// then it's a podcastindex id
		const pid = +id.slice(1);
		const [podcast, session] = await Promise.all([
			pindex.podcastById(pid).then((p) => p.feed),
			locals.auth.validate(),
		]);

		depends('podcast');

		const subscription = session
			? db
					.selectFrom('Subscription')
					.innerJoin('Feed', 'Feed.id', 'Subscription.feedId')
					.where((eb) =>
						eb.or([
							eb('podcastIndexId', '=', pid),
							eb('Feed.feedUrl', '=', podcast.url),
						]),
					)
					.where('Subscription.userId', '=', session.user.userId)
					.selectAll('Subscription')
					.executeTakeFirst()
			: null;
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
