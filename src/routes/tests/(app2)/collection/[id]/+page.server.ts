import { error, fail } from '@sveltejs/kit';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { db } from '$lib/db';
import { annotations } from '$lib/db/selects';
import { nanoid } from '$lib/nanoid';
import { selectEntryFromLibrary } from '$lib/queries/entry';
import { validateAuthedForm } from '$lib/schemas';
import pin from '$lib/server/actions/pin';

import type { Actions, PageServerLoad } from './$types';

const collectionSchema = z.object({
	description: z.string().nullish(),
	name: z.string(),
});

export const load = (async ({ depends, locals, params }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401);
	}
	const { user } = session;
	depends('collection');
	const collection = await db
		.selectFrom('Collection as c')
		.leftJoin('Favorite as p', 'p.collectionId', 'c.id')
		.select(['c.id', 'c.name', 'p.id as pin_id', 'c.description'])
		.select((eb) => [
			jsonArrayFrom(
				eb
					.selectFrom('CollectionItems as ci')
					.select([
						'ci.id',
						'ci.entryId',
						'ci.annotationId',
						'ci.note',
						'ci.type',
						'ci.collectionId',
						'ci.width',
						'ci.position',
					])
					.select((eb) => [
						jsonObjectFrom(
							eb
								.selectFrom('Entry as e')
								.select([
									'e.id',
									'e.image',
									'e.published',
									'e.type',
									'e.title',
									'e.author',
									'e.uri',
									'e.tmdbId',
									'e.googleBooksId',
									'e.spotifyId',
									'e.podcastIndexId',
									'e.wordCount',
									// 'e.html',
								])
								// .select(eb => selectEntryFromLibrary(eb, user.userId).as('entry2'))
								.whereRef('e.id', '=', 'ci.entryId'),
						).as('entry'),
						jsonObjectFrom(
							eb
								.selectFrom('Annotation as a')
								.leftJoin('Entry as e', 'a.entryId', 'e.id')
								.select(annotations.notebook_select)
								.whereRef('a.id', '=', 'ci.annotationId'),
						).as('annotation'),
						// collectionItem.withAnnotation(eb).as("annotation")
					])
					.whereRef('ci.collectionId', '=', 'c.id')
					.where(({ cmpr, or }) =>
						or([
							cmpr('ci.entryId', 'is not', null),
							cmpr('ci.annotationId', 'is not', null),
							// cmpr('ci.type', '=', 'Section')
						]),
					)
					.orderBy('ci.position')
					.orderBy('ci.createdAt'),
			).as('items'),
		])
		.where('c.userId', '=', user.userId)
		.where('c.id', '=', +params.id)
		.executeTakeFirstOrThrow();
	// Todo: make nested json objects type nullable
	console.timeEnd('collection');
	return {
		collection,
		form: superValidate(collection, collectionSchema),
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	add_section: async ({ locals, params }) => {
		// todo
		console.log('hello');
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		const id = nanoid();
		await db
			.insertInto('CollectionItems')
			.values({
				collectionId: +params.id,
				id,
				position: 0,
				type: 'Section',
				updatedAt: new Date(),
			})
			.execute();
	},
	edit: validateAuthedForm(
		collectionSchema,
		async ({ form, params, session }) => {
			const { description, name } = form.data;
			await db
				.updateTable('Collection')
				.set({
					description,
					name,
					updatedAt: new Date(),
				})
				.where('id', '=', +params.id)
				.where('userId', '=', session.user.userId)
				.execute();
		},
	),
	pin: async ({ locals, params, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}

		const data = await request.formData();

		const pin_id = data.get('pin_id');

		if (pin_id && typeof pin_id === 'string') {
			await db
				.deleteFrom('Favorite')
				.where('id', '=', pin_id)
				.where('userId', '=', session.user.userId)
				.execute();
		} else {
			// insert
			const id = nanoid();
			await db
				.insertInto('Favorite')
				.values({
					collectionId: +params.id,
					id,
					updatedAt: new Date(),
					userId: session.user.userId,
				})
				.execute();
		}
	},
};
