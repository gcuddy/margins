import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { locals, depends } = event;
	const { user } = await locals.validateUser();
	// console.log(`(app)/layout.server.ts load function`);
	if (user) {
		// load settings
		event.depends("user:settings")
		const caller = router.createCaller(await createContext(event));
		const stylesheets = await caller.user.stylesheets();
		return {
			stylesheets
		}
	}
	return {
		// user,
	};
};
