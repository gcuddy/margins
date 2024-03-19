import { tmdb } from '$lib/api/tmdb';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const { id } = params;
	console.log({ id });
	return {
		person: tmdb.person.details(+id),
	};
}) satisfies PageServerLoad;

