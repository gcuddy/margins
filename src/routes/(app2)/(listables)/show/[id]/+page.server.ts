import pindex from '$lib/api/pindex';

export const load = ({ params }) => {
	const { id } = params;
	if (id.startsWith('p')) {
		// then it's a podcastindex id
		const pid = +id.slice(1);
		const podcast = pindex.podcastById(pid);
		return {
			// episodes:
			lazy: {
				episodes: pindex.episodesByFeedId(pid).then((p) => p.items),
			},

			podcast: podcast.then((p) => p.feed),
		};
	} else {
		return {
			podcast: null,
		};
	}
};
