import { createContext } from '$lib/trpc/context';
import { appRouter } from '$lib/trpc/router';
import type { Entry } from '@prisma/client';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { locals, depends } = event;
	const { user } = await locals.validateUser();
	// console.log(`(app)/layout.server.ts load function`);
	if (user) {
		// load settings
		event.depends("user:settings")
		const caller = appRouter.createCaller(await createContext(event));
		const { stylesheets, states, subscriptions, bookmarks } = await caller.user.data({
			bookmarks: false,
			subscriptions: true,
			stylesheets: true,
			states: true
		});
		const allEntries = bookmarks.map(b => b.entry).filter(e => e) as Entry[];
		// TODO: we should return a mutable store with this, but can't do that on the server (instead use layout.ts)
		// const userStore

		const locations = ["inbox", "soon", "later", "archive"]
		const sortedStates = states?.sort((a, b) => locations.indexOf(a.type) - locations.indexOf(b.type))
		return {
			stylesheets,
			subscriptions,
			states: sortedStates,
			user,
			// subscriptions,
			// bookmarks,
			// allEntries
		}
	}
	return {
		// user,
	};
};
