import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { params, locals } = event;
	const { session, user } = await locals.validateUser();
	if (user && user.username === params.username) {
		return { user };
	} else {
		throw error(401, 'Not authorized');
	}
};
