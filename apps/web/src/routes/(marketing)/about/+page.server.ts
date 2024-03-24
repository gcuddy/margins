import type { PageServerLoad } from './$types';
// export const prerender = true;

export const load: PageServerLoad = async ({ locals }) => {
	console.log(`marketing page load`);
	// const session = locals.session;
	// if (session) {
	//     throw redirect(302, '/library/now')
	// }
	// const { session, user } = await locals.validateUser();
	// if (session && user) {
	//     throw redirect(302, `/u:${user.username}/inbox`);
	// }
};
