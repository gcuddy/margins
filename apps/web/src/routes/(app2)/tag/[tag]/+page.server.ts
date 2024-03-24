import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

import { db } from '$lib/db';
import { nanoid } from '$lib/nanoid';
import { bulkEntriesSchema } from '$lib/schemas';
import { loginRedirect } from '$lib/utils/redirects';
import { redirect } from 'sveltekit-flash-message/server';

export async function load(event) {
	const { locals, params } = event;
	const session = locals.session;
	const { tag } = params;

	if (!session) {
		throw loginRedirect(event);
	}

	const tagDetails = db
		.selectFrom('Tag')
		.leftJoin('Favorite as pin', 'pin.tagId', 'Tag.id')
		.where('Tag.name', '=', tag)
		.where('Tag.userId', '=', session.user.userId)
		.select(['Tag.id', 'Tag.name', 'Tag.color', 'pin.id as pin_id'])
		.executeTakeFirstOrThrow();

	return {
		bulkForm: superValidate(bulkEntriesSchema),
		session,
		tagDetails,
		// updateTagForm: superValidate(updateTagSchema)
	};
}

export const actions = {
	delete: async (event) => {
		// delete tag...
		const session = event.locals.session;
		if (!session) {
			return fail(401);
		}
		const { userId } = session.user;
		await db
			.deleteFrom('Tag')
			.where('name', '=', event.params.tag)
			.where('userId', '=', userId)
			.execute();
		throw redirect(
			'/library/backlog',
			{
				status: 'info',
				text: `Deleted tag ${event.params.tag}`,
			},
			event,
		);
		// TODO: add message
	},
	pin: async ({ locals, request }) => {
		const session = locals.session;
		if (!session) {
			return fail(401);
		}

		const data = await request.formData();

		const pin_id = data.get('pin_id');
		const tag_id = data.get('tag_id');

		if (!tag_id || typeof tag_id !== 'string') {
			return fail(400, {
				message: 'tag_id is required',
			});
		}

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
					tagId: +tag_id,
					updatedAt: new Date(),
					userId: session.user.userId,
				})
				.execute();
		}
	},
	updateTag: async () => {},
};
