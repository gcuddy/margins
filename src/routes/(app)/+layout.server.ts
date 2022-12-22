import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, depends }) => {
	// const { user } = await locals.validateUser();
	// console.log(`(app)/layout.server.ts load function`);
	return {
		// user,
	};
};
