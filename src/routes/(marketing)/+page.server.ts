import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
// export const prerender = true;

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.validateUser();
	if (session && user) {
		throw redirect(302, `/u:${user.username}/inbox`);
	}
};
