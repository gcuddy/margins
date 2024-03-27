import { getPosts } from '../../../lib/server/blog';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const posts = await getPosts();

	return {
		posts,
	};
}) satisfies PageServerLoad;
