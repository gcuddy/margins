import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	console.log('(login)', { session });
	if (session) {
		console.log('session exists');
		throw redirect(302, '/inbox');
	}
};
