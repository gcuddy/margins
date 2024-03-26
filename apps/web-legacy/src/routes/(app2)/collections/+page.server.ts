import { error, redirect } from '@sveltejs/kit';
import { jsonArrayFrom } from 'kysely/helpers/mysql';
import { superValidate } from 'sveltekit-superforms/server';

import { db } from '$lib/db';
import { nameSchema, validateAuthedForm } from '$lib/schemas';

import type { PageServerLoad } from './$types';
import { loginRedirect } from '$lib/utils/redirects';
import { collectionCreate } from '$lib/db/queries/collections';

export const load = (async (event) => {
	const session = event.locals.session;
	if (!session) {
		throw loginRedirect(event);
	}
	// console.time("collections")
	const collections = await db
		.selectFrom('Collection as c')
		.select(['c.name', 'c.id'])
		.select((eb) => [
			jsonArrayFrom(
				eb
					.selectFrom('CollectionItems as ci')
					.innerJoin('Entry as e', 'e.id', 'ci.entryId')
					.select(['ci.id', 'e.image'])
					.whereRef('ci.collectionId', '=', 'c.id')
					.limit(5),
			).as('items'),
		])
		.where('userId', '=', session.user.userId)
		.where('deleted', 'is', null)
		.orderBy('c.createdAt', 'desc')
		.execute();
	// console.timeEnd("collections")
	const form = superValidate(nameSchema);
	return {
		collections,
		form,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: validateAuthedForm(nameSchema, async ({ form, session }) => {
		const { name } = form.data;

		const { id } = await collectionCreate({
			ctx: { userId: session.user.userId },
			input: { name },
		});

		if (id && Number.isInteger(id)) {
			redirect(303, `/collection/${id}`);
		}
		return {
			form,
		};
	}),
};
