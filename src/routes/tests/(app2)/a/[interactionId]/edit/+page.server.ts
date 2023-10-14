import { db } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export const actions = {
	delete: async (event) => {
		const { interactionId } = event.params;

		await db
			.deleteFrom('EntryInteraction')
			.where('id', '=', +interactionId)
			.execute();

		throw redirect(303, `/tests/library/backlog`);
	},
};
