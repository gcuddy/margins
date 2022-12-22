import { redirect } from '@sveltejs/kit';

import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';

import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const { session, user } = await event.locals.validateUser();
	console.log(`location page.server`, { user });
	if (!session) {
		throw redirect(302, `/u:${event.params.username}`);
	}
	console.time('entries');
	const entries = await router.createCaller(await createContext(event)).entries.list();
	console.timeEnd('entries');
	console.log(`locationlocation`, { entries });
	return {
		user,
		testing: 'HELLO',
		entries,
	};
};
