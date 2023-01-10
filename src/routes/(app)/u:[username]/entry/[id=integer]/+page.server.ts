import { error, fail, redirect } from '@sveltejs/kit';

import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';

import { createContext } from '$lib/trpc/context';
import { appRouter, createCaller } from '$lib/trpc/router';
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
	const { id } = evt.params;
	const caller = await createCaller(evt);
	// const [entry, bookmark] = await Promise.all([caller.public.loadEntry({
	// 	id: +id
	// }),
	// caller.bookmarks.byEntry({
	// 	entryId: +id
	// })
	// ]);
	const entry = await caller.entries.load({
		id: +id
	});
	return {
		article: {
			...entry,
		},
		// article: {
		// 	...entry,
		// 	bookmark,
		// 	tags: [],
		// 	annotations: [],
		// 	unread: false
		// },
		user,
		authorized,
	};
};

export const actions: Actions = {
	save: async (evt) => {
		try {
			const { params, locals, request } = evt;
			const { user } = await locals.validateUser();
			if (!user) {
				throw error(401, 'Not authorized');
			}
			const data = await request.formData();
			const stateId = (data.get('stateId') as string | undefined) || user.default_state_id;
			const id = data.get('id') || '';
			const uri = data.get('url') as string;
			console.log({ id, uri });
			const serverRouter = appRouter.createCaller(await createContext(evt));
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
				///toggle - check if exists first
				// todo: this prolly an ineficient way to dhis
				const bookmark = await serverRouter.bookmarks.add({
					url: uri,
					entryId: Number(params.id),
					stateId: Number(stateId),
				})
				// const bookmark = await db.bookmark.create({
				// 	data: {
				// 		uri,
				// 	},
				// });
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
	download: async (evt) => {
		// Downloads custom data to entrydata
		const url = (await evt.request.formData()).get("url")
		if (!url || typeof url !== "string") {
			return fail(400, {
				message: "missing url"
			})
		}
		const serverRouter = appRouter.createCaller(await createContext(evt));
		const article = await serverRouter.public.parse(url as string);
		console.log({ article })
		const entryData = await serverRouter.entries.addData({
			id: +evt.params.id,
			article
		});
		console.log({ entryData })
		return {
			entryData
		}
	},
	note: async (evt) => {
		const caller = await createCaller(evt);
		const { request, params } = evt;
		const data = await request.formData();
		const annotation = data.get("annotation");
		if (typeof annotation !== "string" || !annotation) {
			return fail(400, {
				annnotation: false
			})
		}
		const createdAnnotation = await caller.annotations.note({
			entryId: +params.id,
			body: annotation
		});
		return {
			annotation: createdAnnotation
		}
	},
	updateNote: async (evt) => {
		const caller = await createCaller(evt);
		const { request, params } = evt;
		const data = await request.formData();
		const annotation = data.get("annotation");
		const id = data.get('id');
		if (typeof annotation !== "string" || !annotation || typeof id !== "string" || !id) {
			return fail(400, {
				missing: true
			})
		}
		const updatedAnnotation = await caller.annotations.update({
			id: +id,
			data: {
				body: annotation
			}
		})
		return {
			annotation: updatedAnnotation
		}
	},
};
