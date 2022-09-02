import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { get } from 'svelte/store';
import { podcasts as podcastsStore, podcast_search_results } from '../store';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ params, setHeaders, fetch }) => {
	const id = Number(params.itunes_id);
	let feedUrl: string;
	let search_results;
	if (browser && (search_results = get(podcast_search_results))) {
		console.log({ search_results });
		feedUrl = search_results?.results?.find((result) => result.collectionId === id)?.feedUrl;
		console.log('fetched feedUrl from results, no need to fetch again');
	}
	console.log({ feedUrl });
	setHeaders({
		'cache-control': 'private, max-age=300',
	});
	// check for existence in page.data

	// const podcasts = get(podcastsStore);
	// console.log({ podcasts });
	// if (podcasts.find((podcast) => podcast.id === id.toString())) {
	// 	return {
	// 		// TODO
	// 	};
	// }

	// this *should* be cached (using cache-control, but maybe there's a better way)
	if (!feedUrl) {
		({ feedUrl } = await fetch('/api/lookup_itunes_id/' + id)
			.then((res) => res.json())
			.catch((e) => {
				throw error(400, e);
			}));
		console.log({ feedUrl });
	}

	const req = `/api/fetch_feed?url=${encodeURIComponent(feedUrl)}`;
	console.log({ req });
	const podcast = await fetch(req)
		.then((res) => res.json())
		.catch((e) => {
			throw error(400, e);
		});

	console.timeEnd('loadPodcast');

	return {
		podcast: {
			...podcast,
			id,
		},
	};
};
