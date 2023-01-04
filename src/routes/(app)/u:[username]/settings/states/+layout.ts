import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const data = await parent();
	return {
		title: 'States',
		...data
		// subtitle: 'Manage your stylesheets',
	};
};
