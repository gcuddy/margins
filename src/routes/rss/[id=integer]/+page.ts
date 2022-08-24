import type { PageLoad } from './$types';
export const load: PageLoad = async ({ data }) => {
	return {
		currentSubscriptionTitle: data.feed.title,
		...data
	};
};
