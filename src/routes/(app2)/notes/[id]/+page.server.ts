import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { superValidate } from 'sveltekit-superforms/server';
import { note_schema } from '../schema.js';
import type { Actions, PageServerLoad } from './$types.js';
import {
	annotations,
	entrySelect,
	genericWithEntry,
	withEntry,
} from '$lib/db/selects';
import { jsonObjectFrom } from 'kysely/helpers/mysql';
import { loginRedirect } from '$lib/utils/redirects';

export const load = (async (event) => {
	const { locals, params } = event;
	const session = await locals.auth.validate();
	// TODO: check if public
	if (!session) throw loginRedirect(event);
	const { id } = params;
	const note = await db
		.selectFrom('Annotation as a')
		.select([
			'id',
			'title',
			'body',
			'contentData',
			'userId',
			'target',
			'exact',
			'deleted',
		])
		.select((eb) =>
			jsonObjectFrom(
				eb
					.selectFrom('Entry as e')
					.select(entrySelect)
					.whereRef('e.id', '=', 'a.entryId'),
			).as('entry'),
		)
		.select(annotations.with.references)
		.where('id', '=', id)
		.where('userId', '=', session.user.userId)
		// .where('type', '=', 'document')
		.executeTakeFirstOrThrow();

	const form = await superValidate(
		{
			...note,
			type: 'document',
			references: note.references.map((r) => r.id),
		},
		note_schema,
	);
	return {
		note,
		form,
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	delete: async ({ locals, params }) => {
		const session = await locals.auth.validate();
		if (!session) throw error(401);
		await db
			.updateTable('Annotation')
			.where('id', '=', params.id)
			.where('userId', '=', session.user.userId)
			.set({
				deleted: new Date(),
			})
			.execute();
		throw redirect(303, '/notes');
	},
	restore: async ({ locals, params }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await db
			.updateTable('Annotation')
			.where('id', '=', params.id)
			.where('userId', '=', session.user.userId)
			.set({
				deleted: null,
			})
			.execute();
	},
};
