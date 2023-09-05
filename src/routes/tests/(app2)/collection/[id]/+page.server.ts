import { db } from '$lib/db';
import { error, fail } from '@sveltejs/kit';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';
import type { Actions, PageServerLoad } from './$types';
import pin from '$lib/server/actions/pin';
import { nanoid } from '$lib/nanoid';
import { annotations } from '$lib/db/selects';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { validateAuthedForm } from '$lib/schemas';
import { selectEntryFromLibrary } from '$lib/queries/entry';

const collectionSchema = z.object({
	name: z.string(),
	description: z.string().nullish(),
});

export const load = (async ({ params, locals, depends }) => {
	const session = await locals.auth.validate();
	if (!session) throw error(401);
	const { user } = session;
	console.time('collection');
	depends('collection');
	const collection = await db
		.selectFrom('Collection as c')
		.leftJoin('Favorite as p', 'p.collectionId', 'c.id')
		.select(['c.id', 'c.name', 'p.id as pin_id', 'c.description'])
		.select((eb) => [
			jsonArrayFrom(
				eb
					.selectFrom('CollectionItems as ci')
					.select(['ci.id', 'ci.entryId', 'ci.note', 'ci.type'])
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
								])
                                // .select(eb => selectEntryFromLibrary(eb, user.userId).as('entry2'))
								.whereRef('e.id', '=', 'ci.entryId'),
						).as('entry'),
						jsonObjectFrom(
							eb
								.selectFrom('Annotation as a')
								.innerJoin('Entry as e', 'a.entryId', 'e.id')
								.select(annotations.notebook_select)
								.whereRef('a.id', '=', 'ci.annotationId'),
						).as('annotation'),
						// collectionItem.withAnnotation(eb).as("annotation")
					])
					.whereRef('ci.collectionId', '=', 'c.id')
					.where(({ or, cmpr }) =>
						or([
							cmpr('ci.entryId', 'is not', null),
							cmpr('ci.annotationId', 'is not', null),
							// cmpr('ci.type', '=', 'Section')
						]),
					)
					.orderBy('ci.position'),
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
	edit: validateAuthedForm(
		collectionSchema,
		async ({ form, params, session }) => {
			const { name, description } = form.data;
			await db
				.updateTable('Collection')
				.set({
					name,
					description,
					updatedAt: new Date(),
				})
				.where('id', '=', +params.id)
				.where('userId', '=', session.user.userId)
				.execute();
		},
	),
	pin: async ({ locals, request, params }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);

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
					id,
					userId: session.user.userId,
					collectionId: +params.id,
					updatedAt: new Date(),
				})
				.execute();
		}
	},
	add_section: async ({ locals, params }) => {
		// todo
		console.log('hello');
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		const id = nanoid();
		await db
			.insertInto('CollectionItems')
			.values({
				id,
				collectionId: +params.id,
				position: 0,
				type: 'Section',
				updatedAt: new Date(),
			})
			.execute();
	},
};
