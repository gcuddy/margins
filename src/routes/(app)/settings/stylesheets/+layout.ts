import type { PageLoad } from './$types';

export const load: PageLoad = ({ data }) => {
	console.log({ data });
	return {
		title: 'Stylesheets',
		subtitle: 'Manage your stylesheets',
		...data,
	};
};
