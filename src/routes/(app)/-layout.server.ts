import { error } from '@sveltejs/kit';

import { getUserData } from '$lib/user';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, depends }) => {
	const session = await locals.auth.validate();
	console.log(`(app)/layout.server.ts load function`);
	if (session?.userId) {
		// TODO: determine if I should fetch articles etc here...?
		try {
			depends('app:user');
			console.log(`running app:user`);
			const user = await getUserData(session.user.userId);
			if (!user) {
				console.error('User not found');
			}
			console.log({ user });
			return {
				user,
			};
		} catch (e) {
			console.error(e);
			throw error(400, 'Error occured');
		}
	}
};
