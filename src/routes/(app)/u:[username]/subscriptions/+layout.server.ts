import { createContext } from '$lib/trpc/context';
import { appRouter, createCaller } from '$lib/trpc/router';
import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { params, locals } = event;
	const { session, user } = await locals.validateUser();
	const caller = await createCaller(event);
	const subscriptions = await caller.subscriptions.list();
	if (user && user.username === params.username) {
		return { subscriptions };
	} else {
		throw error(401, 'Not authorized');
	}
};
