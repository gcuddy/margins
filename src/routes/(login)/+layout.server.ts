import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// console.log(`(login)/layout.server`);
	// const { session, user } = await locals.validateUser();
	// if (session && user) {
	// 	// TODO: customize "home"
	// 	throw redirect(302, `/u:${user.username}/inbox`);
	// }
};
