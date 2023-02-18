import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent, data }) => {
	const { podcast } = await parent();
	const item = podcast.items.find((item) => item.uuid === params.episode_uuid);
	return {
		item,
	};
};
