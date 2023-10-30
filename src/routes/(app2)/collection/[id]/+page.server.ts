import { error, fail, redirect } from '@sveltejs/kit';
import { sql } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/mysql';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { db } from '$lib/db';
import { annotations } from '$lib/db/selects';
import { nanoid } from '$lib/nanoid';
import { validateAuthedForm } from '$lib/schemas';

import type { Actions, PageServerLoad } from './$types';
import type { CollectionItemWidth } from '$lib/schemas/inputs/collection.schema';
import { loginRedirect } from '$lib/utils/redirects';

const collectionSchema = z.object({
	description: z.string().nullish(),
	name: z.string(),
});

export const load = (async (event) => {
	const { depends, locals, params } = event;
	const session = await locals.auth.validate();
	depends('collection');
	const collection = await db
		.selectFrom('Collection as c')
		.leftJoin('Favorite as p', 'p.collectionId', 'c.id')
		.innerJoin('auth_user as u', 'u.id', 'c.userId')
		.select([
			'c.id',
			'c.name',
			'p.id as pin_id',
			'c.description',
			'c.bgColor',
			'c.font',
			'c.private',
			'c.deleted',
			'c.defaultItemWidth',
			'c.userId',
			'u.username',
		])
		.$narrowType<{
			defaultItemWidth: CollectionItemWidth | null;
		}>()
		// If there's no icon, default to "Box"
		.select((eb) => [
			eb.fn.coalesce('c.icon', sql<string>`"Box"`).as('icon'),
			eb.fn.coalesce('c.color', sql<string>`"#000000"`).as('color'),
		])
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
					.where(({ or, eb }) =>
						or([
							eb('ci.entryId', 'is not', null),
							eb('ci.annotationId', 'is not', null),
							// cmpr('ci.type', '=', 'Section')
						]),
					)
					.orderBy('ci.position')
					.orderBy('ci.createdAt'),
			).as('items'),
		])
		.where('c.id', '=', +params.id)
		.executeTakeFirstOrThrow();

	if (collection.private) {
		// check if user is allowed to view
		if (!session || session.user.userId !== collection.userId) {
			throw loginRedirect(event);
		}
	}

	// Todo: make nested json objects type nullable
	return {
		admin: session?.user.userId === collection.userId,
		collection,
		form: superValidate(collection, collectionSchema),
		session,
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	add_section: async ({ locals, params }) => {
		// todo
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
	delete: async ({ locals, params }) => {
		const session = await locals.auth.validate();
		if (!session) {
			return fail(401);
		}
		await db
			.updateTable('Collection')
			.set({
				deleted: new Date(),
				updatedAt: new Date(),
			})
			.where('id', '=', +params.id)
			.where('userId', '=', session.user.userId)
			.execute();
		throw redirect(303, `/collections`);
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
