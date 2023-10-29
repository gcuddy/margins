import { bulkEntriesSchema, validateAuthedForm } from '$lib/schemas';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

import { db } from '$lib/db';
import { getFirstBookmarkSort } from '$lib/db/selects';
import { loginRedirect } from '$lib/utils/redirects';
import type { Actions } from './$types';
export const load = async (e) => {
	const session = await e.locals.auth.validate();
	if (!session) throw loginRedirect(e);
};

// entryids
const idSchema = z.array(z.coerce.number()).nonempty();
const statusSchema = z.enum(['Backlog', 'Now', 'Archive']);

export const actions: Actions = {
	update: validateAuthedForm(bulkEntriesSchema, (e) => {
		console.log(e);
	}),
	update_status: async ({ locals, request, url }) => {
		const sesh = await locals.auth.validate();
		if (!sesh) return fail(401);
		// get ids
		const data = await request.formData();
		try {
			console.log('ids', data.getAll('ids'));
			console.log('status', data.get('status'));
			const ids = idSchema.parse(data.getAll('id'));
			const status = statusSchema.parse(
				data.get('status') ?? url.searchParams.get('status'),
			);

			// sort to top of list
			const new_sort_order = await getFirstBookmarkSort(sesh.userId, status);
			await db
				.updateTable('Bookmark')
				.where('entryId', 'in', ids)
				.where('userId', '=', sesh.userId)
				.set({
					status,
					sort_order: new_sort_order,
				})
				.execute();
		} catch (e) {
			console.dir({ e }, { depth: null });
			return fail(400);
		}
	},
};
