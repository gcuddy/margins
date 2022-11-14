import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	console.log('(marketing)/+page.server.ts', { session });
	if (session) {
		throw redirect(302, '/inbox');
	}
};
