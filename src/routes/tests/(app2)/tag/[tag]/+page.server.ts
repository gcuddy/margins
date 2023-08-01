import { db } from '$lib/db';
import type { EntryInList } from '$lib/db/selects';
import { nanoid } from '$lib/nanoid';
import { get_notes_for_tag } from '$lib/queries/server';
import { bulkEntriesSchema } from '$lib/schemas';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export async function load({ locals, params, url, fetch }) {
	const session = await locals.validate();
	const { tag } = params;

	if (!session) {
		throw error(401, 'Unauthorized');
	}

	// use api route for pagination
	const [{ entries, nextCursor }, tag_deets] = await Promise.all([
		fetch(
			`/api/entries/tag/${params.tag}.json?cursor=${url.searchParams.get('cursor') ?? ''}`
		).then(
			(r) =>
				r.json() as Promise<{
					entries: (EntryInList & {
						tag_id: number;
					})[];
					nextCursor: number | undefined;
				}>
		),
		db
			.selectFrom('Tag')
			.leftJoin('Favorite as pin', 'pin.tagId', 'Tag.id')
			.where('Tag.name', '=', tag)
			.where('Tag.userId', '=', session.userId)
			.select(['Tag.id', 'Tag.name', 'pin.id as pin_id'])
			.executeTakeFirstOrThrow()
	]);

	return {
		tag: tag_deets,
		entries,
		nextCursor,
		session,
		bulkForm: superValidate(bulkEntriesSchema),
		notes: get_notes_for_tag({
			name: tag,
			userId: session.userId
		})
	};
}

export const actions = {
	pin: async ({ locals, request }) => {
		const session = await locals.validate();
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
				.where('userId', '=', session.userId)
				.execute();
		} else {
			// insert
			const id = nanoid();
			await db
				.insertInto('Favorite')
				.values({
					id,
					userId: session.userId,
					updatedAt: new Date(),
					tagId: +tag_id
				})
				.execute();
		}
	}
};
