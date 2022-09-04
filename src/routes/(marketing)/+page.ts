import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	// this might be causing the redirect problem?
	const { lucia } = await parent();
	console.log(`(marketing)`, { lucia });
	if (lucia) throw redirect(302, '/inbox');
	return {
		user: null,
	};
};
