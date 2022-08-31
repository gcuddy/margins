import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import { podcasts as podcastsStore } from '../store';

export const load: LayoutLoad = async ({ params, setHeaders, fetch }) => {
	const id = Number(params.itunes_id);
	setHeaders({
		'cache-control': 'private, max-age=300',
	});
	// check for existence in page.data

	const podcasts = get(podcastsStore);
	console.log({ podcasts });
	if (podcasts.find((podcast) => podcast.id === id.toString())) {
		return {
			// TODO
		};
	}

	// this *should* be cached (using cache-control, but maybe there's a better way)
	const { feedUrl } = await fetch('/api/lookup_itunes_id/' + id)
		.then((res) => res.json())
		.catch((e) => {
			throw error(400, e);
		});
	console.log({ feedUrl });
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
