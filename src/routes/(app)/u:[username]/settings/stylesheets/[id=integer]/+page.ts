import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';
export const load: PageLoad = async ({ data, parent, params }) => {
	console.log({ data });
	const { stylesheets } = await parent();
	const stylesheet = stylesheets.find((s) => Number(params.id) === s.id);
	if (!stylesheet) {
		throw error(404, 'not found');
	}
	return {
		stylesheet,
	};
};
