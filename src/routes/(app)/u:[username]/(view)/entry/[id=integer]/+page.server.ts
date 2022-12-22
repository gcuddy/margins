import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (evt) => {
	const { session, user } = await evt.locals.validateUser();
	if (!session) {
		throw redirect(302, '/login');
	}
	let authorized = true;
	if (user?.username !== evt.params.username) {
		// check if public, else say you don't have access
		authorized = false;
	}
	return {
		user,
		authorized,
	};
};

export const actions: Actions = {
	save: async ({ params, locals, request }) => {
		try {
			const { user } = await locals.validateUser();
			if (!user) {
				throw error(401, 'Not authorized');
			}
			const data = await request.formData();
			const stateId = (data.get('stateId') as string | undefined) || user.default_state_id;
			const id = data.get('id') || '';
			const uri = data.get('url') as string;
			console.log({ id });
			if (+id) {
				// SOFT DELETE
				await db.bookmark.update({
					where: {
						id: +id,
					},
					data: {
						deleted: new Date(),
					},
				});
			} else {
				//toggle - check if exists first
				// todo: this prolly an ineficient way to dhis
				const bookmark = await db.bookmark.create({
					data: {
						entryId: Number(params.id),
						userId: user.userId,
						stateId: Number(stateId),
						uri,
					},
				});
				return { bookmark };
			}
		} catch (e) {
			console.error(e);
			throw error(400, 'error saving');
		}
	},
	tag: async (evt) => {
		// set tag on item
		const session = await evt.locals.validate();
		if (!session) {
			throw error(401);
		}
		// const data = await evt.request.formData();
		const data = await getJsonFromRequest(evt.request);
		const tags = data.tags as {
			id?: string;
			name: string;
		}[]; // not quite right type, could include {id, name}
		const newTags = tags.filter((t) => !t.id);
		// Sequential transaction - create any tags that need creating, then set the value of the entry's tags to be the tags passed in
		db.$transaction([
			db.tag.createMany({
				skipDuplicates: true,
				data: newTags.map(({ name }) => {
					return {
						name,
						userId: session.userId,
					};
				}),
			}),
			db.entry.update({
				where: {
					id: +evt.params.id,
				},
				data: {
					tags: {
						set: tags.map(({ name }) => {
							return {
								name_userId: {
									name,
									userId: session.userId,
								},
							};
						}),
					},
				},
			}),
		]);
	},
};
