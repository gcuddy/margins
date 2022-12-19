import { error, fail, redirect } from '@sveltejs/kit';

import { db } from '$lib/db';
import { chosenIcon } from '$lib/types/icon';

import type { Actions } from './$types';
export const actions: Actions = {
	default: async ({ locals, request, params }) => {
		const session = await locals.validate();
		if (!session) throw error(401);

		try {
			const data = await request.formData();
			const name = data.get('name') as string;
			const description = data.get('description') as string;
			const icon = chosenIcon.parse(JSON.parse(data.get('icon') as string));

			const result = await db.collection.upsert({
				where: {
					userId_name: {
						userId: session.userId,
						name,
					},
				},
				create: {
					name,
					description,
					icon,
					userId: session.userId,
				},
				update: {
					name,
					description,
					icon,
				},
			});
			console.log({ result });
			// redirect, right?
			return {
				location: `/u:${params.username}/collection/${result.id}`,
			};
			throw redirect(303, `/u/${params.username}/collection/${result.id}`);
		} catch (e) {
			console.error(e);
			return fail(400, {
				message: 'error creating collection',
			});
		}
	},
};
