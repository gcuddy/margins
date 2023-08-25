import { db } from '$lib/db';
import type { EntryInList } from '$lib/db/selects';
import { nanoid } from '$lib/nanoid';
import { get_notes_for_tag, updateTagSchema } from '$lib/queries/server';
import { bulkEntriesSchema } from '$lib/schemas';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export async function load({ locals, params, url, fetch }) {
	const session = await locals.auth.validate();
	const { tag } = params;

	if (!session) {
		throw error(401, 'Unauthorized');
	}


	return {
		session,
		bulkForm: superValidate(bulkEntriesSchema),
        // updateTagForm: superValidate(updateTagSchema)
	};
}

export const actions = {
	pin: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);

		const data = await request.formData();

		const pin_id = data.get('pin_id');
		const tag_id = data.get('tag_id');

		if (!tag_id || typeof tag_id !== 'string')
			return fail(400, {
				message: 'tag_id is required'
			});

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
					updatedAt: new Date(),
					tagId: +tag_id
				})
				.execute();
		}
	},
    updateTag: async () => {

    }
};
