import { error } from '@sveltejs/kit';

import { db } from '$lib/db';

import type { Actions } from './$types';
export const actions: Actions = {
	makeDefault: async ({ locals, request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		const session = await locals.validate();
		if (!session) {
			throw error(401, 'Unauthorized');
		}
		try {
			await db.user.update({
				where: {
					id: session.userId,
				},
				data: {
					default_state_id: Number(id),
				},
			});
			return {
				success: true,
			};
		} catch (e) {
			console.error(e);
			throw error(400);
		}
	},
};
