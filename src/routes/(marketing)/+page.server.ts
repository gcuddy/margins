import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
// export const prerender = true;

export const load: PageServerLoad = async ({ locals }) => {
    console.log(`marketing page load`)
    // const session = await locals.validate();
    // if (session) {
    //     throw redirect(302, '/tests/library/now')
    // }
    // const { session, user } = await locals.validateUser();
    // if (session && user) {
    //     throw redirect(302, `/u:${user.username}/inbox`);
    // }
};
