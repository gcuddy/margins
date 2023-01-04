import { error, fail } from '@sveltejs/kit';

import { db } from '$lib/db';

import type { Actions } from './$types';
import { appRouter } from '$lib/trpc/router';
import { createContext } from '$lib/trpc/context';
export const actions: Actions = {
	update: async (evt) => {
		const data = await evt.request.formData();
		const id = data.get("id");
		const name = data.get("name");
		const color = data.get("color");
		console.log({ id, name, color })
		if (typeof id !== "string" || typeof name !== "string" || typeof color !== "string") {
			fail(400,
				{
					message: "invalid input"
				})
			return
		};
		const caller = appRouter.createCaller(await createContext(evt));
		const state = await caller.user.updateStates({
			id: +id,
			name,
			color
		});
		return {
			success: true
		}
	},
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
