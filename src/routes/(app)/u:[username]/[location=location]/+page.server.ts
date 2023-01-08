import { redirect } from '@sveltejs/kit';

import { createContext } from '$lib/trpc/context';
import { appRouter } from '$lib/trpc/router';

import type { PageServerLoad } from './$types';
import type { Location } from '@prisma/client';
export const load: PageServerLoad = async (event) => {
	const { params, locals } = event;
	const { session, user } = await locals.validateUser();
	console.log(`location page.server`, { user });
	if (!session) {
		throw redirect(302, `/u:${event.params.username}`);
	}
	const location = params.location.toLowerCase() as Location | "all";
	const entries = await appRouter.createCaller(await createContext(event)).entries.listBookmarks({
		location
	});
	return {
		user,
		location,
		entries
	};
};
