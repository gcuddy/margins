import { db, json } from '$lib/db';
import { nanoid } from '$lib/nanoid';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export async function load() {
	const srs_notes = await db.selectFrom('Annotation').where('srs', '=', 1).where('deleted', 'is', null).selectAll().orderBy("due_timestamp", 'asc').execute();

	return {
		srs_notes
	};
}

export const actions: Actions = {
	new: async ({ request, locals }) => {
		const session = await locals.validate();
		if (!session) return fail(401);
		const data = await request.formData();
		const body = data.get('body');
		const response = data.get('response');

		if (!body || typeof body !== 'string' || !response || typeof response !== 'string') {
			return fail(400);
		}

		const id = data.get('id') ?? nanoid();

		if (typeof id !== 'string') return fail(400);

		const entry_id = data.get('entry_id');
		const parent_id = data.get('parent_id');
        const target = data.get('target');

        console.log({target});

		await db
			.insertInto('Annotation')
			.values({
				body,
				response,
				type: 'qa',
				srs: 1,
				id,
				srs_created_at: new Date(),
				updatedAt: new Date(),
				createdAt: new Date(),
				entryId: entry_id ? +entry_id : null,
				parentId: typeof parent_id === 'string' ? parent_id : null,
                target: typeof target === 'string' ? json(JSON.parse(target)) : null,
				userId: session.userId
			})
			.onDuplicateKeyUpdate({
				body,
				response,
				updatedAt: new Date()
			})
			.execute();

		return {
			success: true,
			id
		};
	}
};