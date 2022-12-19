import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ locals, params, parent }) => {
	console.log(`u/layout.server`);
	const { user } = await locals.validateUser();
	console.log({ user });
	let AUTHORIZED = false;
	if (!user || user.username !== params.username) {
		//redirect to just /u:username for "public" version
	} else {
		// TODO: and maybe redirect to "home"?
		AUTHORIZED = true;
	}
	return {
		AUTHORIZED,
		allTags: [],
		user,
	};
};
